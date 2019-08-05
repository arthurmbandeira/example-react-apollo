const id = (root) => root.id;
const description = (root) => root.description;
const url = (root) => root.url;
const createdAt = (root) => root.createdAt;

const postedBy = (root, args, context) => {
  return context.prisma.link({ id: root.id }).postedBy();
}

const votes = (root, args, context) => {
  return context.prisma.link({ id: root.id }).votes()
}

module.exports = {
  id,
  description,
  url,
  createdAt,
  postedBy,
  votes,
}
