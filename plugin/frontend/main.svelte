<script lang="ts">
  import { onMount } from 'svelte';
  import { Layout, GeneralService, sdk } from '@becomes/cms-ui';

  let message = '';

  onMount(async () => {
    message = await GeneralService.errorWrapper(
      async () => {
        return await sdk.send({
          url: '/plugin/my-awesome-plugin/hello',
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
      },
      async (result: { message: string }) => {
        return result.message;
      },
    );
  });
</script>

<Layout>
  <h1>{message}</h1>
</Layout>
