import { Router } from 'express';
import commentController from '../controllers/comment.controller';
import { CommentDto } from '../dto/request/comment.dto';
import validateDto from '../middleware/validateDto.midleware';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', 
    auth ,validateDto(CommentDto), commentController.addComment);

export default router;
