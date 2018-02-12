import Vue from "vue";
import { EventType } from ".";

export interface Payload<T> {
  type: keyof T;
}

export interface MutationPayload<T> extends Payload<T> {
  payload: any;
}

export interface ActionPayload<T> extends Payload<T> {
  payload: any;
}

export interface DispatchOptions {
  root?: boolean;
}

export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

export interface Dispatch<T> {
  (type: keyof T, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends ActionPayload<T>>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

export interface Commit<T> {
  (type: keyof T, payload?: any, options?: CommitOptions): void;
  <P extends MutationPayload<T>>(payloadWithType: P, options?: CommitOptions): void;
}
