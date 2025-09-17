import { Request, Response, NextFunction } from 'express';
import commentService from '../service/comment.service';
import ApiError from '../middleware/ApiError';
import sendResponse from '../dto/response/send-response';

class CommentController {
    async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            const commentDto = req.data;

            if (!userId) {
                throw new ApiError(401, 'Vui lòng đăng nhập để thêm bình luận');
            }

            const comment = await commentService.addComment(userId, commentDto);
            sendResponse(res, {
                code: 201,
                message: 'Thêm bình luận thành công !',
                result: comment
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();