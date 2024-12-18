<script>
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Input,
		Select,
		Modal
	} from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let users = [];
	let authGroups = [];
	let searchTerm = '';
	let selectedUser = null;
	let showAuthModal = false;
	let showEditModal = false;
	let editingUser = null;
    const apiBaseUrl = "http://localhost:3000/admin"; // API Base URL

	async function fetchUsers() {
		try {
			const response = await fetch(`${apiBaseUrl}/users`);
			users = await response.json();
		} catch (error) {
			console.error('사용자 목록 조회 실패:', error);
		}
	}

	async function fetchAuthGroups() {
		try {
			const response = await fetch(`${apiBaseUrl}/users/auth-groups`);
			authGroups = await response.json();
		} catch (error) {
			console.error('권한 그룹 목록 조회 실패:', error);
		}
	}

	async function updateUserAuthGroup() {
		try {
			const response = await fetch(`${apiBaseUrl}/users/auth-group/${selectedUser.Id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: selectedUser.Id,
					authGroupId: selectedUser.Auth_Group_Id
				})
			});
			
			if (response.ok) {
				showAuthModal = false;
				await fetchUsers();
			}
		} catch (error) {
			console.error('권한 그룹 변경 실패:', error);
		}
	}

	async function updateUser() {
		try {
			const response = await fetch(`${apiBaseUrl}/users/${editingUser.Id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: editingUser.Name,
					nicName: editingUser.Nic_Name
				})
			});
			
			if (response.ok) {
				showEditModal = false;
				await fetchUsers();
			}
		} catch (error) {
			console.error('사용자 정보 수정 실패:', error);
		}
	}

	async function deleteUser(userId) {
		if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
			try {
				const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
					method: 'DELETE'
				});
				
				if (response.ok) {
					await fetchUsers();
				}
			} catch (error) {
				console.error('사용자 삭제 실패:', error);
			}
		}
	}

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
	}

	$: filteredUsers = users.filter(user => 
		user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.Nic_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.Auth_Group_Name?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	let sortBy = 'date'; // 'date' | 'products'

	$: sortedUsers = [...filteredUsers].sort((a, b) => {
		if (sortBy === 'products') {
			return (b.Product_Count || 0) - (a.Product_Count || 0);
		}
		if (!a.Enter_Date) return 1;
		if (!b.Enter_Date) return -1;
		return b.Enter_Date.localeCompare(a.Enter_Date);
	});

	function toggleSort() {
		sortBy = sortBy === 'date' ? 'products' : 'date';
	}

	onMount(() => {
		fetchUsers();
		fetchAuthGroups();
	});
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">사용자 관리</h1>

	<div class="mb-4 flex items-center justify-between">
		<div class="relative">
			<SearchOutline class="absolute left-3 top-3 h-5 w-5 text-gray-500" />
			<Input 
				bind:value={searchTerm}
				placeholder="이름 또는 닉네임으로 검색" 
				class="pl-10 w-80"
			/>
		</div>
		<Button 
			size="sm"
			outline
			color="light"
			on:click={toggleSort}
		>
			{sortBy === 'date' ? '날짜순' : '상품수순'} 정렬
		</Button>
	</div>

	<Table>
		<TableHead>
			<TableHeadCell>이름</TableHeadCell>
			<TableHeadCell>닉네임</TableHeadCell>
			<TableHeadCell>권한 그룹</TableHeadCell>
			<TableHeadCell>등록 상품수</TableHeadCell>
			<TableHeadCell>가입일</TableHeadCell>
			<TableHeadCell>관리</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each sortedUsers as user}
				<TableBodyRow>
					<TableBodyCell>{user.Name}</TableBodyCell>
					<TableBodyCell>{user.Nic_Name || '-'}</TableBodyCell>
					<TableBodyCell>{user.Auth_Group_Name || '권한 없음'}</TableBodyCell>
					<TableBodyCell>
						<div class="flex items-center gap-2">
							<span class="font-medium">{user.Product_Count}</span>
						</div>
					</TableBodyCell>
					<TableBodyCell>{formatDate(user.Enter_Date)}</TableBodyCell>
					<TableBodyCell>
						<div class="flex gap-2">
							<Button 
								size="sm"
								color="light"
								on:click={() => {
									selectedUser = user;
									showAuthModal = true;
								}}
							>
								권한 변경
							</Button>
							<Button 
								size="sm"
								outline
								color="blue"
								on:click={() => {
									editingUser = {...user};
									showEditModal = true;
								}}
							>
								수정
							</Button>
							<Button 
								size="sm"
								outline
								color="red"
								on:click={() => deleteUser(user.Id)}
							>
								삭제
							</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Modal bind:open={showAuthModal} size="sm">
	<div class="p-6">
		<h3 class="mb-4 text-xl font-semibold">권한 그룹 변경</h3>
		{#if selectedUser}
			<div class="mb-4">
				<p class="mb-2">사용자: {selectedUser.Name}</p>
				<Select 
					bind:value={selectedUser.Auth_Group_Id}
					class="w-full"
				>
					<option value={null}>권한 없음</option>
					{#each authGroups as group}
						<option value={group.Id}>{group.Name}</option>
					{/each}
				</Select>
			</div>
			<div class="flex justify-end gap-2">
				<Button color="alternative" on:click={() => showAuthModal = false}>
					취소
				</Button>
				<Button color="alternative" on:click={updateUserAuthGroup}>
					저장
				</Button>
			</div>
		{/if}
	</div>
</Modal>

<Modal bind:open={showEditModal} size="sm">
	<div class="p-6">
		<h3 class="mb-4 text-xl font-semibold">사용자 정보 수정</h3>
		{#if editingUser}
			<div class="mb-4">
				<div class="mb-3">
					<label class="block mb-1">이름</label>
					<Input 
						bind:value={editingUser.Name}
						placeholder="이름을 입력하세요"
					/>
				</div>
				<div class="mb-3">
					<label class="block mb-1">닉네임</label>
					<Input 
						bind:value={editingUser.Nic_Name}
						placeholder="닉네임을 입력하세요"
					/>
				</div>
			</div>
			<div class="flex justify-end gap-2">
				<Button outline color="alternative" on:click={() => showEditModal = false}>
					취소
				</Button>
				<Button outline on:click={updateUser}>
					저장
				</Button>
			</div>
		{/if}
	</div>
</Modal>