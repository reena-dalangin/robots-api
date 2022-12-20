export class ServiceResponse {
  async transform(data: any) {
    return {
      data: {
        type: 'robots',
        attributes: data
      }
    };
  }
}
