export class Image {
  constructor(
    public id: string,
    public title: string,
    public url: string,
    public order: number,
    public ownerId: string,
    public createdAt: Date = new Date()
  ) {}
}
