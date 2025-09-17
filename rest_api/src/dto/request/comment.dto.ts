import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  content: string | undefined

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number | undefined

  @IsNotEmpty()
  @IsString()
  productId: string | undefined
}