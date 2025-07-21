export async function handler(event) {
  return {
    statusCode: event,
    body: JSON.stringify({
      message: 'Deu boa! Vamos criar a conta...',
    }),
  }
}