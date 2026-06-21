# Eval Requirements

Detailed token requirements live in [reports/eval-requirements.json](reports/eval-requirements.json).

|Skill|Evals|Eval|Must contain any|Must not contain|
|---|---:|---:|---|---|
|aria-live-regions|5|1|`role="status"`, `aria-live="polite"`, `announce`|`role="alert"`, `aria-live="assertive"`|
|aria-live-regions|5|2|`aria-atomic="true"`, `results found`, `search-status`|`aria-hidden="true"`, `display:none`|
|aria-live-regions|5|3|`role="alert"`, `aria-live="assertive"`, `session warning`|`aria-live="polite"`|
|aria-live-regions|5|4|`aria-atomic="false"`, `aria-live="polite"`, `chat-log`|`aria-atomic="true"`|
|aria-live-regions|5|5|`visually-hidden`, `clip:`, `overflow: hidden`|`display:none`, `aria-hidden="true"`|
|color-contrast|5|1|`--color-text`, `prefers-color-scheme: dark`, `var(--`|`color: #aaa`, `placeholder`|
|color-contrast|5|2|`border`, `3:1`, `currentColor`|`box-shadow`, `opacity: 0.4`|
|color-contrast|5|3|`:focus-visible`, `forced-colors: active`, `outline`|`outline: none`, `box-shadow`|
|color-contrast|5|4|`aria-invalid`, `icon`, `required`|`color only`, `red border only`|
|color-contrast|5|5|`contrast`, `prefers-color-scheme`, `focus ring`|`hardcode`, `low contrast`|
|forms|5|1|`<label`, `type="email"`, `required`|`placeholder=`, `aria-required="true"`|
|forms|5|2|`aria-invalid="true"`, `aria-describedby`, `role="alert"`|`invalid input`|
|forms|5|3|`<fieldset`, `<legend`, `type="radio"`|N/A|
|forms|5|4|`autocomplete="bday-day"`, `autocomplete="bday-month"`, `autocomplete="bday-year"`|`type="date"`|
|forms|5|5|`inputmode="numeric"`, `pattern=`, `type="text"`|`type="number"`|
|image-alt-text|5|1|`alt=""`, `decorative`|`alt="decorative"`, `alt="spacer"`|
|image-alt-text|5|2|`Go to homepage`, `Search`, `alt="`|`image of`, `photo of`|
|image-alt-text|5|3|`figcaption`, `aria-describedby`, `Bar chart`|`blue and green`, `image of the chart`|
|image-alt-text|5|4|`50% off`, `Summer Sale`, `alt="`|`sale banner showing`, `image of text`|
|image-alt-text|5|5|`Rating:`, `out of 5 stars`, `alt=""`|`alt="star"`, `alt="image"`|
|keyboard|5|1|`<button`, `<a href=`, `type="button"`|`role="button"`, `tabindex="0"`, `onclick=`|
|keyboard|5|2|`Enter`, `Space`, `tabindex="0"`|`mouse only`, `click only`|
|keyboard|5|3|`:focus-visible`, `outline`, `focus ring`|`outline: none`|
|keyboard|5|4|`Escape`, `focus`, `inert`|`keyboard trap`|
|keyboard|5|5|`tabindex="0"`, `tabindex="-1"`, `Arrow`|`positive tabindex`|
|light-dark-mode|5|1|`color-scheme: light dark`, `light-dark(`, `--color-text`|`theme tokens duplicated`, `JS required`, `hardcoded colours`|
|light-dark-mode|5|2|`contrast-color(`, `@supports (color: contrast-color(red))`, `button`|`color-contrast(`, `JS required`|
|light-dark-mode|5|3|`black or white`, `mid-tone`, `manual WCAG contrast`|`testing is optional`, `guarantee`|
|light-dark-mode|5|4|`@supports not (color: contrast-color(red))`, `prefers-color-scheme`, `light-dark(`|`JS required`, `theme tokens duplicated`|
|light-dark-mode|5|5|`browser support`, `forced-colors`, `manual WCAG contrast`|`automated tools only`, `JS required`|
|maps|5|1|`alt="Campus map`, `main entrance`, `library`|`alt="image`, `alt="map"`|
|maps|5|2|`Skip map`, `title="Interactive map`, `map-skip-target`|`role="application"`, `no title`|
|maps|5|3|`Zoom in`, `Zoom out`, `Escape`|`mouse only`, `role="application"`|
|maps|5|4|`<table`, `<ul`, `Accessible library branches`|`map only`, `visual only`|
|maps|5|5|`legend`, `text labels`, `forced-colors`|`colour only`, `color only`|
|navigation|5|1|`<nav`, `aria-current="page"`, `tabindex="-1"`|N/A|
|navigation|5|2|`<nav`, `<ul`, `<a`|N/A|
|navigation|5|3|`aria-label="Breadcrumb"`, `<ol`, `aria-current="page"`|N/A|
|navigation|5|4|`aria-expanded`, `aria-controls`, `hidden`|N/A|
|navigation|5|5|`<nav`, `aria-label="Footer"`|N/A|
|progressive-enhancement|5|1|`<form`, `action=`, `method="get"`|`must use JavaScript`, `JS required`|
|progressive-enhancement|5|2|`<nav`, `<a href=`, `JavaScript`|`rendered only in JS`, `spa only`|
|progressive-enhancement|5|3|`'fetch' in window`, `querySelector`, `feature detection`|`userAgent`, `browser detection`|
|progressive-enhancement|5|4|`serviceWorker`, `register`, `catch`|`break the page`, `must install`|
|progressive-enhancement|5|5|`semantic HTML`, `prefers-reduced-motion`, `forced-colors`|`display:none`, `core content inaccessible`|
|svg|5|1|`aria-hidden="true"`, `focusable="false"`|`<title>`, `<desc>`, `role="img"`|
|svg|5|2|`role="img"`, `aria-labelledby`, `<title`|`aria-hidden="true"`, `<text`|
|svg|5|3|`<desc>`, `aria-labelledby`, `role="img"`|`aria-describedby`, `<text`|
|svg|5|4|`prefers-reduced-motion`, `animation`, `static`|`infinite`, `begin="indefinite"`|
|svg|5|5|`<img`, `role="img"`, `alt="`|`aria-hidden="true"`, `role="presentation"`|
|tables|5|1|`<caption>`, `scope="col"`, `scope="row"`|`summary=`, `role="presentation"`|
|tables|5|2|`scope="colgroup"`, `colspan=`, `<thead>`|`summary=`, `role="presentation"`|
|tables|5|3|`headers=`, `id=`, `<caption>`|`summary=`, `role="presentation"`|
|tables|5|4|`grid`, `flex`, `<section`|`<table`, `role="presentation"`|
|tables|5|5|`<caption>`, `<thead>`, `<tbody>`|`summary=`, `<table border=`|
|tooltips|5|1|`aria-describedby`, `role="tooltip"`, `hidden`|`aria-labelledby`, `tabindex="0"`, `aria-hidden="true"`|
|tooltips|5|2|`Escape`, `hideTooltip`, `hidden`|`preventDefault()`, `focus()`|
|tooltips|5|3|`aria-expanded`, `aria-controls`, `button`|`hover only`, `title="`|
|tooltips|5|4|`aria-label="Delete item"`, `aria-describedby`, `aria-hidden="true"`|`role="tooltip" on the trigger`, `aria-labelledby`|
|tooltips|5|5|`prefers-reduced-motion`, `transition`, `role="tooltip"`|`animation: infinite`, `aria-hidden="true"`|
|touch-pointer|5|1|`<meta name="viewport"`, `width=device-width`, `initial-scale=1`|`user-scalable=no`, `maximum-scale=1`|
|touch-pointer|5|2|`Zoom in`, `Zoom out`, `aria-label="Zoom in"`|`pinch only`, `two-finger`|
|touch-pointer|5|3|`Move`, `up`, `down`|`drag only`, `swipe only`|
|touch-pointer|5|4|`44px`, `min-width`, `min-height`|`16px only`, `touch target under 24x24`|
|touch-pointer|5|5|`click`, `mouseup`, `touchend`|`mousedown`, `touchstart`|
