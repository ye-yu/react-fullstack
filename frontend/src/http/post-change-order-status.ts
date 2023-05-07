export async function postChangeOrderStatus(
  orderId: number,
  status: string
): Promise<boolean> {
  if (!process.env.REACT_APP_BACKEND_URL) return false;
  try {
    const url = new URL(
      "/orders/" + orderId,
      process.env.REACT_APP_BACKEND_URL
    );
    const request = await fetch(url, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status }),
      mode: "cors",
    });
    return request.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
