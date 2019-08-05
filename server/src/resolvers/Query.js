const feed = async (root, args, context, info) => {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {};

  const links = await context.prisma.links({
    where: {
      OR: [
        { description_contains: args.filter },
        { url_contains: args.filter },
      ],
    },
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });

  const count = await context.prisma
    .linksConnection({
      where: {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter },
        ],
      },
    })
    .aggregate()
    .count();

  return {
    links,
    count
  };
}

const link = (_, args, context) => {
  return context.prisma.links().filter((link) => {
    if (link.id === args.id) return link 
  })[0];
}

const info = () => 'Lorem ipsum dolor sit amet.';

module.exports = {
  feed,
  link,
  info
}