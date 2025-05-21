import express, { Router } from 'express';

export abstract class BaseRouter<T> {
  public router: Router = express.Router();
  protected controller: T;

  constructor(controller: T) {
    this.controller = controller;
    this.setRoutes();
  }

  protected abstract setRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }
}