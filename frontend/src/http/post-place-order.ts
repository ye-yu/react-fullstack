export async function postPlaceOrder(productId: number): Promise<boolean> {
  if (!process.env.REACT_APP_BACKEND_URL) return false;
  try {
    const url = new URL("/orders", process.env.REACT_APP_BACKEND_URL);
    const request = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    return request.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
