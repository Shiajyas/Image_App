export class User {
  constructor(

    public email: string,
    public phone: string,
    public password: string,
    public avatar?: string,
    public _id?: string,
  ) {}
}
