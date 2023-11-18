import { Router } from 'express';

import {
  createPerson,
  updatePerson,
  deletePerson,
  movePeople,
} from './people-controller';

const router = Router();

router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);
router.post('/move', movePeople);

export default router;
