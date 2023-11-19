import { Router } from 'express';

import {
  createPerson,
  updatePerson,
  deletePerson,
  movePeople,
  getAboveLevelGroups,
} from './people-controller';

const router = Router();

router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);
router.post('/move', movePeople);
router.get('/:personId/groups', getAboveLevelGroups);

export default router;
