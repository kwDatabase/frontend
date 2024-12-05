<script>
	import {
		Avatar,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Checkbox,
		Heading,
		Indicator
	} from 'flowbite-svelte';
	import Users from './users.json';
	import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
	import { TableHeadCell, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte';
	import { CogSolid, DotsVerticalOutline, DownloadSolid } from 'flowbite-svelte-icons';
	import {
		EditOutline,
		ExclamationCircleSolid,
		PlusOutline,
		TrashBinSolid
	} from 'flowbite-svelte-icons';

	let openUser = false; // modal control
	let openDelete = false; // modal control

	let current_user = {};
</script>

<!-- <MetaTag {path} {description} {title} {subtitle} /> -->

<main class="relative w-full overflow-y-auto">
	<div class="p-4">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
			사용자 관리
		</Heading>

		<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
			<Input placeholder="Search for users" class="me-4 w-80 border xl:w-96" />

			<div slot="end" class="flex items-center space-x-2">
				<Button
					size="sm"
					class="gap-2 whitespace-nowrap px-3"
					on:click={() => ((current_user = {}), (openUser = true))}
				>
					<PlusOutline size="sm" />Add user
				</Button>
			</div>
		</Toolbar>
	</div>
	<Table class="border border-gray-300 dark:border-gray-700">
		<TableHead class="">
			{#each ['Name', 'Position', 'Country', 'Status', 'Actions'] as title}
				<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each Users as user}
				<TableBodyRow class="text-base">
					<TableBodyCell class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
						<div class="text-sm font-normal text-gray-500 dark:text-gray-400">
							<div class="text-base font-semibold text-gray-900 dark:text-white">{user.name}</div>
							<div class="text-sm font-normal text-gray-500 dark:text-gray-400">{user.email}</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="p-4">{user.position}</TableBodyCell>
					<TableBodyCell class="p-4">{user.country}</TableBodyCell>
					<TableBodyCell class="p-4 font-normal">
						<div class="flex items-center gap-2">
							<Indicator color={user.status === 'Active' ? 'green' : 'red'} />
							{user.status}
						</div>
					</TableBodyCell>
					<TableBodyCell class="space-x-2 p-4">
						<Button
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = user), (openUser = true))}
						>
							<EditOutline size="sm" /> Edit user
						</Button>
						<Button
							color="red"
							size="sm"
							class="gap-2 px-3"
							on:click={() => ((current_user = user), (openDelete = true))}
						>
							<TrashBinSolid size="sm" /> Delete user
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>

<!-- Modals -->

<!-- <User bind:open={openUser} data={current_user} />
<Delete bind:open={openDelete} /> -->