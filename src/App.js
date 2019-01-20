export default async function app() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('October');
    }, 1000);
  });
}
