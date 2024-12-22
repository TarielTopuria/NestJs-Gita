import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from "@nestjs/common";

class Optional {
  optional: boolean
}

export class PricePipe implements PipeTransform {
  private optional = false;
  constructor({ optional }: Optional) {
    this.optional = optional;
  };

  transform(value: any, metadata: ArgumentMetadata) {
    if (this.optional) return value;
    if (value === undefined || value === null) return value;
    if (isNaN(Number(value))) throw new HttpException("Price must be number!", HttpStatus.BAD_REQUEST);
    if (Number(value) < 0) throw new HttpException("Price must not be less than 0!", HttpStatus.BAD_REQUEST);
    return value;
  };
}