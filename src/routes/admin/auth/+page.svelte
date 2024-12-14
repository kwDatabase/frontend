<script>
  import { onMount } from 'svelte';
  import { Button, Input } from 'flowbite-svelte';
  
  let authList = [];
  let authGroups = [];
  let newGroupName = '';
  let selectedAuths = [];
  let editingGroup = null;
  let editGroupName = '';
  let editingGroupAuths = [];
  
  const apiBaseUrl = 'http://localhost:3000/admin';

  onMount(async () => {
    await Promise.all([
      fetchAuths(),
      fetchAuthGroups()
    ]);
  });

  const fetchAuths = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth`);
      if (!response.ok) throw new Error('Failed to fetch auths');
      authList = await response.json();
    } catch (error) {
      console.error('Error fetching auths:', error);
    }
  };

  const fetchAuthGroups = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/groups`);
      if (!response.ok) throw new Error('Failed to fetch auth groups');
      authGroups = await response.json();
    } catch (error) {
      console.error('Error fetching auth groups:', error);
    }
  };

  const addAuthGroup = async () => {
    if (newGroupName.trim() && selectedAuths.length > 0) {
      if (newGroupName.length > 20) {
        alert('권한 그룹 이름은 최대 20자입니다.');
        return;
      }
      try {
        const response = await fetch(`${apiBaseUrl}/auth/groups`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newGroupName,
            auths: selectedAuths
          })
        });
        if (!response.ok) throw new Error('Failed to create auth group');
        newGroupName = '';
        selectedAuths = [];
        await fetchAuthGroups();
      } catch (error) {
        console.error('Error creating auth group:', error);
      }
    }
  };

  const saveEditGroup = async () => {
    if (editGroupName.trim() && editingGroup) {
      if (editGroupName.length > 20) {
        alert('권한 그룹 이름은 최대 20자입니다.');
        return;
      }
      try {
        const response = await fetch(`${apiBaseUrl}/auth/groups/${editingGroup.Id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: editGroupName,
            auths: editingGroupAuths
          })
        });
        if (!response.ok) throw new Error('Failed to edit auth group');
        editingGroup = null;
        editGroupName = '';
        editingGroupAuths = [];
        await fetchAuthGroups();
      } catch (error) {
        console.error('Error editing auth group:', error);
      }
    }
  };

  const deleteAuthGroup = async (groupId) => {
    if (confirm('정말로 이 권한 그룹을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/groups/${groupId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete auth group');
        await fetchAuthGroups();
      } catch (error) {
        console.error('Error deleting auth group:', error);
      }
    }
  };
</script>

<div class="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
  <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      권한 관리
    </h2>
    <div class="space-y-4">
      <div class="flex gap-3">
        <Input
          bind:value={newGroupName}
          placeholder="새 권한 그룹 이름을 입력하세요"
          class="flex-1"
        />
        <Button 
          on:click={addAuthGroup}
          color="alternative"
        >
          권한 그룹 추가
        </Button>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-medium mb-2">권한 선택</h3>
        <div class="grid grid-cols-3 gap-2">
          {#each authList as auth}
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                bind:group={selectedAuths}
                value={auth.Id}
                class="form-checkbox"
              />
              <span>{auth.Name}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-4">
    {#each authGroups as group}
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div class="flex flex-col gap-4">
          {#if editingGroup === group}
            <div class="flex items-center justify-between">
              <div class="flex-1 mr-4">
                <Input 
                  bind:value={editGroupName}
                  class="w-full"
                />
              </div>
              <div class="flex gap-2">
                <Button 
                  on:click={saveEditGroup}
                  color="alternative"
                >
                  저장
                </Button>
                <Button 
                  on:click={() => {
                    editingGroup = null;
                    editGroupName = '';
                    editingGroupAuths = [];
                  }}
                  color="light"
                >
                  취소
                </Button>
              </div>
            </div>
            <div class="mt-4">
              <h4 class="text-md font-medium mb-2">권한 수정</h4>
              <div class="grid grid-cols-3 gap-2">
                {#each authList as auth}
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      bind:group={editingGroupAuths}
                      value={auth.Id}
                      checked={group.Auths.some(groupAuth => groupAuth.Id === auth.Id)}
                      class="form-checkbox"
                    />
                    <span>{auth.Name}</span>
                  </label>
                {/each}
              </div>
            </div>
          {:else}
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">{group.Name}</h3>
              <div class="flex gap-2">
                <Button
                  on:click={() => {
                    editingGroup = group;
                    editGroupName = group.Name;
                    editingGroupAuths = group.Auths.map(auth => auth.Id);
                  }}
                  outline
                  color="blue"
                >
                  수정
                </Button>
                <Button
                  on:click={() => deleteAuthGroup(group.Id)}
                  outline
                  color="red"
                >
                  삭제
                </Button>
              </div>
            </div>
            <div class="mt-2">
              <h4 class="text-md font-medium mb-2">포함된 권한:</h4>
              <div class="flex flex-wrap gap-2">
                {#each group.Auths as auth}
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md text-sm">
                    {auth.Name}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>