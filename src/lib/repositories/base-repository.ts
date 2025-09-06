import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';

/**
 * Base repository interface that defines common CRUD operations
 */
export interface IBaseRepository<T, InsertT, UpdateT> {
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<T[]>;
  create(data: InsertT): Promise<T | null>;
  update(id: string, data: UpdateT): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Options for querying data
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  filters?: {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'is';
    value: any;
  }[];
}

/**
 * Base repository implementation using Supabase
 */
export abstract class BaseRepository<T, InsertT, UpdateT> implements IBaseRepository<T, InsertT, UpdateT> {
  protected client: SupabaseClient<Database>;
  protected tableName: string;

  constructor(client: SupabaseClient<Database>, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      return null;
    }

    return data as unknown as T;
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    let query = this.client.from(this.tableName).select('*');

    // Apply filters if provided
    if (options?.filters) {
      for (const filter of options.filters) {
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.column, filter.value);
            break;
          case 'neq':
            query = query.neq(filter.column, filter.value);
            break;
          case 'gt':
            query = query.gt(filter.column, filter.value);
            break;
          case 'gte':
            query = query.gte(filter.column, filter.value);
            break;
          case 'lt':
            query = query.lt(filter.column, filter.value);
            break;
          case 'lte':
            query = query.lte(filter.column, filter.value);
            break;
          case 'in':
            query = query.in(filter.column, filter.value);
            break;
          case 'is':
            query = query.is(filter.column, filter.value);
            break;
        }
      }
    }

    // Apply ordering if provided
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? false,
      });
    }

    // Apply pagination if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      return [];
    }

    return (data as unknown as T[]) || [];
  }

  async create(data: InsertT): Promise<T | null> {
    const { data: created, error } = await this.client
      .from(this.tableName)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      return null;
    }

    return created as unknown as T;
  }

  async update(id: string, data: UpdateT): Promise<T | null> {
    const { data: updated, error } = await this.client
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }

    return updated as unknown as T;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      return false;
    }

    return true;
  }
}