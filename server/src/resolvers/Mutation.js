const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { APP_SECRET, getUserId } = require('../utils');

const signup = async (root, args, context) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.createUser({ ...args, password });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  }
}

const login = async (root, args, context) => {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

const post = (root, args, context) => {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

const updateLink = (root, args, context) => {
  const link = context.prisma.links().filter((link) => {
    if (link.id === args.id) {
      link.description = args.description ? args.description : link.description
      link.url = args.url ? args.url : link.url
    }
    return link;
  });
  const updatedLink = link.length ? link[0] : new Error('Cannot find Link by ID');
  return updatedLink;
}

const deleteLink = (root, args, context) => {
  let removed;
  const arrDelete = context.prisma.links().filter((link) => {
    if (link.id !== args.id) {
      return link 
    } else {
      removed = link
    }
  });
  context.prisma.links() = arrDelete;
  return removed;
}

const vote = async (root, args, context, info) => {
  const userId = getUserId(context);

  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });

  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  });
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
  vote
}
