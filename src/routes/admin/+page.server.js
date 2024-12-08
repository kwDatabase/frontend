import { redirect } from '@sveltejs/kit';
  import { browser } from '$app/environment';

  export function load() {
    const isAdmin = true;
    if(!isAdmin){
        redirect(302, '/');
    }
    return {
        layout: 'admin',
      };
  }