// Database client for Cloudflare D1
// Handles all database queries for submissions, gallery, artists, news

import { D1Database } from '@cloudflare/workers-types';

// Type definitions for our database records
export interface Submission {
  id: string;
  handle: string;
  platform: string | null;
  caption: string | null;
  name: string | null;
  original_r2_key: string;
  watermarked_r2_key: string | null;
  status: 'pending' | 'looks_good' | 'needs_review' | 'approved' | 'rejected';
  queue: 'looks_good' | 'needs_review' | null;
  text_filter_result: 'pass' | 'flag' | null;
  image_scan_result: 'pass' | 'flag' | 'error' | null;
  submitted_at: string;
  reviewed_at: string | null;
  approved_at: string | null;
}

export interface GalleryPhoto {
  id: string;
  submission_id: string;
  handle: string;
  caption: string | null;
  watermarked_r2_key: string;
  approved_at: string;
  sort_order: number;
}

export interface Artist {
  id: string;
  name: string;
  genre: string | null;
  bio: string | null;
  social_url: string | null;
  photo_r2_key: string | null;
  year: number;
  set_time: string | null;
  sort_order: number;
}

export interface NewsPost {
  id: string;
  title: string;
  body: string;
  photo_r2_key: string | null;
  published_at: string;
  updated_at: string | null;
}

export interface StoreEmail {
  id: string;
  email: string;
  captured_at: string;
}

// Get D1 database instance from environment
export function getDB(): D1Database {
  // @ts-ignore - runtime binding from Vercel edge config
  return process.env.DB as D1Database;
}

// Submission queries
export const submissionQueries = {
  async create(
    db: D1Database,
    data: {
      id: string;
      handle: string;
      platform?: string;
      caption?: string;
      name?: string;
      original_r2_key: string;
    }
  ): Promise<void> {
    await db
      .prepare(
        `INSERT INTO submissions (id, handle, platform, caption, name, original_r2_key, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.id,
        data.handle,
        data.platform || null,
        data.caption || null,
        data.name || null,
        data.original_r2_key,
        new Date().toISOString()
      )
      .run();
  },

  async getById(db: D1Database, id: string): Promise<Submission | null> {
    const result = await db
      .prepare('SELECT * FROM submissions WHERE id = ?')
      .bind(id)
      .first<Submission>();
    return result || null;
  },

  async getByQueue(db: D1Database, queue: 'looks_good' | 'needs_review'): Promise<Submission[]> {
    const result = await db
      .prepare('SELECT * FROM submissions WHERE queue = ? ORDER BY submitted_at DESC')
      .bind(queue)
      .all<Submission>();
    return result.results || [];
  },

  async updateModerationResults(
    db: D1Database,
    id: string,
    data: {
      text_filter_result: 'pass' | 'flag';
      image_scan_result: 'pass' | 'flag' | 'error';
      status: 'looks_good' | 'needs_review';
      queue: 'looks_good' | 'needs_review';
    }
  ): Promise<void> {
    await db
      .prepare(
        `UPDATE submissions 
         SET text_filter_result = ?, image_scan_result = ?, status = ?, queue = ?
         WHERE id = ?`
      )
      .bind(
        data.text_filter_result,
        data.image_scan_result,
        data.status,
        data.queue,
        id
      )
      .run();
  },

  async approve(
    db: D1Database,
    id: string,
    watermarked_r2_key: string
  ): Promise<void> {
    const now = new Date().toISOString();
    await db
      .prepare(
        `UPDATE submissions 
         SET status = 'approved', watermarked_r2_key = ?, approved_at = ?, reviewed_at = ?
         WHERE id = ?`
      )
      .bind(watermarked_r2_key, now, now, id)
      .run();
  },

  async reject(db: D1Database, id: string): Promise<void> {
    const now = new Date().toISOString();
    await db
      .prepare(
        `UPDATE submissions 
         SET status = 'rejected', reviewed_at = ?
         WHERE id = ?`
      )
      .bind(now, id)
      .run();
  },

  async getQueueCounts(db: D1Database): Promise<{ looks_good: number; needs_review: number }> {
    const looksGood = await db
      .prepare('SELECT COUNT(*) as count FROM submissions WHERE queue = ?')
      .bind('looks_good')
      .first<{ count: number }>();
    
    const needsReview = await db
      .prepare('SELECT COUNT(*) as count FROM submissions WHERE queue = ?')
      .bind('needs_review')
      .first<{ count: number }>();

    return {
      looks_good: looksGood?.count || 0,
      needs_review: needsReview?.count || 0,
    };
  },
};

// Gallery queries
export const galleryQueries = {
  async create(
    db: D1Database,
    data: {
      id: string;
      submission_id: string;
      handle: string;
      caption: string | null;
      watermarked_r2_key: string;
    }
  ): Promise<void> {
    await db
      .prepare(
        `INSERT INTO gallery (id, submission_id, handle, caption, watermarked_r2_key, approved_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.id,
        data.submission_id,
        data.handle,
        data.caption,
        data.watermarked_r2_key,
        new Date().toISOString()
      )
      .run();
  },

  async getAll(db: D1Database): Promise<GalleryPhoto[]> {
    const result = await db
      .prepare('SELECT * FROM gallery ORDER BY approved_at DESC')
      .all<GalleryPhoto>();
    return result.results || [];
  },

  async deleteById(db: D1Database, id: string): Promise<void> {
    await db
      .prepare('DELETE FROM gallery WHERE id = ?')
      .bind(id)
      .run();
  },
};

// Artist queries
export const artistQueries = {
  async create(
    db: D1Database,
    data: {
      id: string;
      name: string;
      genre?: string;
      bio?: string;
      social_url?: string;
      photo_r2_key?: string;
      year: number;
      set_time?: string;
    }
  ): Promise<void> {
    await db
      .prepare(
        `INSERT INTO artists (id, name, genre, bio, social_url, photo_r2_key, year, set_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.id,
        data.name,
        data.genre || null,
        data.bio || null,
        data.social_url || null,
        data.photo_r2_key || null,
        data.year,
        data.set_time || null
      )
      .run();
  },

  async getAll(db: D1Database): Promise<Artist[]> {
    const result = await db
      .prepare('SELECT * FROM artists ORDER BY year DESC, sort_order ASC')
      .all<Artist>();
    return result.results || [];
  },

  async getByYear(db: D1Database, year: number): Promise<Artist[]> {
    const result = await db
      .prepare('SELECT * FROM artists WHERE year = ? ORDER BY sort_order ASC')
      .bind(year)
      .all<Artist>();
    return result.results || [];
  },

  async update(
    db: D1Database,
    id: string,
    data: Partial<Omit<Artist, 'id'>>
  ): Promise<void> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    await db
      .prepare(`UPDATE artists SET ${setClause} WHERE id = ?`)
      .bind(...values, id)
      .run();
  },

  async deleteById(db: D1Database, id: string): Promise<void> {
    await db
      .prepare('DELETE FROM artists WHERE id = ?')
      .bind(id)
      .run();
  },
};

// News queries
export const newsQueries = {
  async create(
    db: D1Database,
    data: {
      id: string;
      title: string;
      body: string;
      photo_r2_key?: string;
    }
  ): Promise<void> {
    await db
      .prepare(
        `INSERT INTO news (id, title, body, photo_r2_key, published_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        data.id,
        data.title,
        data.body,
        data.photo_r2_key || null,
        new Date().toISOString()
      )
      .run();
  },

  async getAll(db: D1Database): Promise<NewsPost[]> {
    const result = await db
      .prepare('SELECT * FROM news ORDER BY published_at DESC')
      .all<NewsPost>();
    return result.results || [];
  },

  async getById(db: D1Database, id: string): Promise<NewsPost | null> {
    const result = await db
      .prepare('SELECT * FROM news WHERE id = ?')
      .bind(id)
      .first<NewsPost>();
    return result || null;
  },

  async update(
    db: D1Database,
    id: string,
    data: { title?: string; body?: string; photo_r2_key?: string }
  ): Promise<void> {
    const now = new Date().toISOString();
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    await db
      .prepare(`UPDATE news SET ${setClause}, updated_at = ? WHERE id = ?`)
      .bind(...values, now, id)
      .run();
  },

  async deleteById(db: D1Database, id: string): Promise<void> {
    await db
      .prepare('DELETE FROM news WHERE id = ?')
      .bind(id)
      .run();
  },
};

// Store email queries
export const storeEmailQueries = {
  async create(db: D1Database, email: string): Promise<void> {
    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO store_emails (id, email, captured_at)
         VALUES (?, ?, ?)`
      )
      .bind(id, email, new Date().toISOString())
      .run();
  },

  async getAll(db: D1Database): Promise<StoreEmail[]> {
    const result = await db
      .prepare('SELECT * FROM store_emails ORDER BY captured_at DESC')
      .all<StoreEmail>();
    return result.results || [];
  },
};
