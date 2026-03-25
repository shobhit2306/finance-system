import { rateLimit } from 'express-rate-limit'
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false, 
})
export default limiter;