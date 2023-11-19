import { Router } from 'express';

import {
  createPerson,
  updatePerson,
  deletePerson,
  movePeople,
  getAboveLevelGroups,
  getPersonsUnderGroup,
} from './people-controller';

const router = Router();

router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);
router.post('/move', movePeople);
router.get('/:personId/groups', getAboveLevelGroups);
router.get('/groups/:groupId/persons', getPersonsUnderGroup);

export default router;
