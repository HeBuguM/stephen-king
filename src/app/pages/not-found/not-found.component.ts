import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent implements OnInit {
	randomQuote;
	quotes = [
		{
			'quote': 'Ако си дете, се учиш да живееш. Възрастните се учат да умират.',
			'source': 'Кристин'
		},{
			'quote': 'Няма такова нещо като щастлив край. Не съм срещал нито един, който може да се мери с "Имало едно време". Всеки край е жесток. Всеки край е просто друг начин да кажеш "сбогом"',
			'source': 'Тъмната кула'
		},{
			'quote': 'Хората не стават по-добри, те стават просто по-умни. Когато станеш по-умен, не спираш да късаш крилцата на мухите, просто си измисляш по-добра причина, за да го правиш.',
			'source': 'Кери'
		},{
			'quote': 'Знаеш ли колко жесток може да бъде твоят Бог, Дейвид? Колко ужасно жесток?... Понякога Той ни кара да живеем.',
			'source': 'Град отчаяние'
		},{
			'quote': 'Да убиваш в името на мира е все едно да се чукаш в името на въздържанието!'
		},{
			'quote': 'А ако не бръмчат коли и самолети, ако никой не е излязъл в гората западно от градчето да стреля по яребици и фазани, ако единственият звук е бавното туптене на собственото ти сърце, тогава можеш да чуеш и още един звук - звука на живота, който бавно се размотава към своя цикличен край, очаквайки първия зимен сняг да го оплаче и покрие с бял саван.',
			'source': 'Сейлъм\'с Лот'
		},{
			'quote': 'Никой не може да каже какво точно те превръща в друг човек. Никой не може с думи да опише онзи тъжен и самотен период от живота ти, прекаран в ада. Няма рецепти как да се промениш. Просто оцеляваш. Или умираш.',
			'source': 'Сейлъм\'с Лот'
		},{
			'quote': 'Човек не винаги трябва да чуе трясъка, за да разбере, че вратата е затръшната.',
			'source': 'Особени сезони'
		},{
			'quote': 'Но всъщност няма какво да се чудя. Нещата винаги се свеждат до две алтернативи: здравата да се заловиш да живееш или здравата да се заловиш да умираш.',
			'source': 'Особени сезони'
		},{
			'quote': 'Надеждата е нещо хубаво, може би най-хубавото нещо, а хубавите неща са безсмъртни!',
			'source': 'Особени сезони'
		},{
			'quote': 'Чудовищата са реални, и призраците също. Те живеят вътре в нас, а понякога ни надделяват.'
		},{
			'quote': 'Земята се върти, това е всичко. Можеш да се въртиш заедно с нея или пък да спреш, за да протестираш, в резултат на което да бъдеш изхвърлен от движението ѝ',
			'source': 'Зеленият път'
		},{
			'quote': 'Остаряването е като да караш през сняг, който става все по-дълбок и по-дълбок. Ако пък случайно излезеш наравно, оказва се заледено и започваш да се въртиш. Това е животът. Няма снегорини, които да дойдат и да те изровят. Спасителният ти кораб просто няма да дойде, малката. Няма и лодки за никого. Никога няма да спечелиш в тази надпревара.',
			'source': 'Пътна мрежа'
		},{
			'quote': 'Мисля, че всеки един от нас, хората, е напълно уникален. Всеки със своята болка и със своите удоволствия и радости; никой друг човек не може да го разбере напълно или да изпита точно същите чувства.',
			'source': 'Гробище за домашни любимци'
		},{
			'quote': 'Времето отмива всичко, независимо дали го искаш или не. Времето отмива всичко, времето отнема всичко и накрая има само мрак. Понякога намираме другите в този мрак, а понякога ги губим в него.',
			'source': 'Зеленият път'
		},{
			'quote': 'За мен страхът е една от най-деликатните емоции, затова винаги се опитвам да уплаша читателя. Ако не мога да го уплаша, аз се опитвам да го смразя от ужас и ако не успея и в това, прибягвам до шока.'
		},{
			'quote': 'Някои хора казват, че съм ужасен човек, но не е истина. Аз имам сърце на младо момче — в буркан на бюрото ми.'
		}
	]
	constructor() { }

	ngOnInit(): void {
		this.randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
	}

}
