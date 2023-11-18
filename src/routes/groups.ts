import { Router } from 'express';

import {
  createGroup,
  updateGroup,
  deleteGroup,
  moveGroup,
} from './groups-controller';

const router = Router();

router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.post('/move', moveGroup);

export default router;
