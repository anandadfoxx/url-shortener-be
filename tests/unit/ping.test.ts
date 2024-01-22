import 'jest';

let baseUrl = 'http://localhost:8080';

const apiFetch = async (endpoint: string, method: string) => {
  return await (await fetch(`${baseUrl}${endpoint}`, {
    method: method
  }))
    .json();
};

describe("Ping", () => {
  it('GET /ping', async () => {
    const response = await apiFetch('/ping', 'GET');
    
    expect(response['success']).toEqual(true);
    expect(response['description']).toEqual('Pong!');
  })
});