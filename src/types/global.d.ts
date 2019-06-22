declare namespace NodeJS {
  interface Global {
    appRoot: string;
  }
}

type TrueResult = { err: string } | true;
type BoolResult = { err: string } | boolean;
