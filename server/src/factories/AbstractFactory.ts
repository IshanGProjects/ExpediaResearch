export interface AbstractFactory {
  createProduct(): AbstractProduct;
}

export interface AbstractProduct {
  performAction(request: { action?: string; params?: { [key: string]: any }; prompt?: string }): Promise<any>;
}
