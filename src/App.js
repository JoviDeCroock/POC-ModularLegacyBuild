export default async function app() {
  return Promise.resolve((resolve) => {
    setTimeout(() => {
      resolve('October');
    }, 1000);
  })
}
