export interface AbstractFactory {
    createProduct(): AbstractProduct;
  }
  
  export interface AbstractProduct {
    performAction(action: string, params: { [key: string]: any }): Promise<any>;
  }
  