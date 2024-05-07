<script lang="ts">
	// * Import
	import { olympus, socket } from "./const.svelte"

	// * State
	let mode = $state<"button" | "input" | "none">("none")

	// * Socket
	socket.on("title", () => (mode = "none"))
	socket.on("kd", () => (mode = "button"))
	socket.on("vcnv", () => (mode = "button"))
	socket.on("tt", () => (mode = "none"))
	socket.on("vd", () => (mode = "button"))
</script>

<div
	class="score absolute left-[17.5%] top-[2.78%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus.current ===
	0
		? 'bg-green-500'
		: olympus.bells.includes(0)
			? 'bg-bell'
			: (mode === 'button' && olympus.contestants[0].button) ||
				  (mode === 'input' && olympus.contestants[0].input)
				? 'bg-gray-500'
				: 'bg-primary'}"
>
	<span style="--value:{Math.floor((olympus.contestants[0].score + 995) / 5)}"></span>
</div>

<div
	class="score absolute left-[42.5%] top-[2.78%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus.current ===
	1
		? 'bg-green-500'
		: olympus.bells.includes(1)
			? 'bg-bell'
			: (mode === 'button' && olympus.contestants[1].button) ||
				  (mode === 'input' && olympus.contestants[1].input)
				? 'bg-gray-500'
				: 'bg-primary'}"
>
	<span style="--value:{Math.floor((olympus.contestants[1].score + 995) / 5)}"></span>
</div>
<div
	class="score absolute left-[67.5%] top-[2.78%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus.current ===
	2
		? 'bg-green-500'
		: olympus.bells.includes(2)
			? 'bg-bell'
			: (mode === 'button' && olympus.contestants[2].button) ||
				  (mode === 'input' && olympus.contestants[2].input)
				? 'bg-gray-500'
				: 'bg-primary'}"
>
	<span style="--value:{Math.floor((olympus.contestants[2].score + 995) / 5)}"></span>
</div>
<div
	class="score absolute left-[92.5%] top-[2.78%] flex h-[8.33%] w-[6.25%] items-center justify-center text-3xl text-black {olympus.current ===
	3
		? 'bg-green-500'
		: olympus.bells.includes(3)
			? 'bg-bell'
			: (mode === 'button' && olympus.contestants[3].button) ||
				  (mode === 'input' && olympus.contestants[3].input)
				? 'bg-gray-500'
				: 'bg-primary'}"
>
	<span style="--value:{Math.floor((olympus.contestants[3].score + 995) / 5)}"></span>
</div>

<style>
	.score {
		line-height: 1em;
		text-align: center;
	}
	.score {
		display: inline-flex;
	}
	.score > * {
		height: 1em;
		display: inline-block;
		overflow-y: hidden;
	}
	.score > *:before {
		position: relative;
		white-space: pre;
		top: calc(var(--value) * -1em);
		text-align: center;
		transition: all 0.5s ease-in-out 1s;
	}

	.score > *:before {
		content: "-995\A -990\A -985\A -980\A -975\A -970\A -965\A -960\A -955\A -950\A -945\A -940\A -935\A -930\A -925\A -920\A -915\A -910\A -905\A -900\A -895\A -890\A -885\A -880\A -875\A -870\A -865\A -860\A -855\A -850\A -845\A -840\A -835\A -830\A -825\A -820\A -815\A -810\A -805\A -800\A -795\A -790\A -785\A -780\A -775\A -770\A -765\A -760\A -755\A -750\A -745\A -740\A -735\A -730\A -725\A -720\A -715\A -710\A -705\A -700\A -695\A -690\A -685\A -680\A -675\A -670\A -665\A -660\A -655\A -650\A -645\A -640\A -635\A -630\A -625\A -620\A -615\A -610\A -605\A -600\A -595\A -590\A -585\A -580\A -575\A -570\A -565\A -560\A -555\A -550\A -545\A -540\A -535\A -530\A -525\A -520\A -515\A -510\A -505\A -500\A -495\A -490\A -485\A -480\A -475\A -470\A -465\A -460\A -455\A -450\A -445\A -440\A -435\A -430\A -425\A -420\A -415\A -410\A -405\A -400\A -395\A -390\A -385\A -380\A -375\A -370\A -365\A -360\A -355\A -350\A -345\A -340\A -335\A -330\A -325\A -320\A -315\A -310\A -305\A -300\A -295\A -290\A -285\A -280\A -275\A -270\A -265\A -260\A -255\A -250\A -245\A -240\A -235\A -230\A -225\A -220\A -215\A -210\A -205\A -200\A -195\A -190\A -185\A -180\A -175\A -170\A -165\A -160\A -155\A -150\A -145\A -140\A -135\A -130\A -125\A -120\A -115\A -110\A -105\A -100\A -95\A -90\A -85\A -80\A -75\A -70\A -65\A -60\A -55\A -50\A -45\A -40\A -35\A -30\A -25\A -20\A -15\A -10\A -5\A 0\A 5\A 10\A 15\A 20\A 25\A 30\A 35\A 40\A 45\A 50\A 55\A 60\A 65\A 70\A 75\A 80\A 85\A 90\A 95\A 100\A 105\A 110\A 115\A 120\A 125\A 130\A 135\A 140\A 145\A 150\A 155\A 160\A 165\A 170\A 175\A 180\A 185\A 190\A 195\A 200\A 205\A 210\A 215\A 220\A 225\A 230\A 235\A 240\A 245\A 250\A 255\A 260\A 265\A 270\A 275\A 280\A 285\A 290\A 295\A 300\A 305\A 310\A 315\A 320\A 325\A 330\A 335\A 340\A 345\A 350\A 355\A 360\A 365\A 370\A 375\A 380\A 385\A 390\A 395\A 400\A 405\A 410\A 415\A 420\A 425\A 430\A 435\A 440\A 445\A 450\A 455\A 460\A 465\A 470\A 475\A 480\A 485\A 490\A 495\A 500\A 505\A 510\A 515\A 520\A 525\A 530\A 535\A 540\A 545\A 550\A 555\A 560\A 565\A 570\A 575\A 580\A 585\A 590\A 595\A 600\A 605\A 610\A 615\A 620\A 625\A 630\A 635\A 640\A 645\A 650\A 655\A 660\A 665\A 670\A 675\A 680\A 685\A 690\A 695\A 700\A 705\A 710\A 715\A 720\A 725\A 730\A 735\A 740\A 745\A 750\A 755\A 760\A 765\A 770\A 775\A 780\A 785\A 790\A 795\A 800\A 805\A 810\A 815\A 820\A 825\A 830\A 835\A 840\A 845\A 850\A 855\A 860\A 865\A 870\A 875\A 880\A 885\A 890\A 895\A 900\A 905\A 910\A 915\A 920\A 925\A 930\A 935\A 940\A 945\A 950\A 955\A 960\A 965\A 970\A 975\A 980\A 985\A 990\A 995\A ";
	}
</style>
