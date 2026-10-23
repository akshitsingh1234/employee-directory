
import { Router, Request, Response } from 'express';
import { pool } from '../db.js';

const router = Router();

function validateEmployee(body: any): string | null {
  const { name, email, role } = body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof role !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !role.trim()
  ) {
    return 'Name, email, and role are required.';
  }

  if (name.trim().length > 100) {
    return 'Name must be at most 100 characters.';
  }

  if (email.trim().length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Please provide a valid email address.';
  }

  if (role.trim().length > 100) {
    return 'Role must be at most 100 characters.';
  }

  return null;
}

// GET /employees?search=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === 'string'
        ? req.query.search.trim()
        : '';

    const result = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM employees
       WHERE name ILIKE $1 OR email ILIKE $1 OR role ILIKE $1
       ORDER BY id DESC`,
      [`%${search}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Fetch employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
});

// POST /employees
router.post('/', async (req: Request, res: Response) => {
  const validationError = validateEmployee(req.body);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const { name, email, role } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO employees (name, email, role)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.trim(), role.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'That email is already in use.' });
      return;
    }

    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee.' });
  }
});

// PUT /employees/:id
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Invalid employee ID.' });
    return;
  }

  const validationError = validateEmployee(req.body);

  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const { name, email, role } = req.body;

  try {
    const result = await pool.query(
      `UPDATE employees
       SET name = $1, email = $2, role = $3
       WHERE id = $4
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.trim(), role.trim(), id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Employee not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'That email is already in use.' });
      return;
    }

    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee.' });
  }
});

// DELETE /employees/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Invalid employee ID.' });
    return;
  }

  try {
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Employee not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
});

export default router;
