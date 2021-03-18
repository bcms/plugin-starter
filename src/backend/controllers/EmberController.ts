import {
  Controller,
  ControllerPrototype,
  Get,
  Logger,
} from "@becomes/purple-cheetah";
import type { Router } from "express";

@Controller()
export class EmberController implements ControllerPrototype {
  baseUri: string;
  initRouter: () => void;
  logger: Logger;
  name: string;
  router: Router;

  @Get("/test")
  test() {
    return {
      message: "This is a message from Ember PLUGIN.",
    };
  }
}
