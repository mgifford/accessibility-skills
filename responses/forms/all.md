# Forms Responses

## Eval 1

```html
<label for="email">Email</label>
<input id="email" type="email" required>
```

## Eval 2

```html
<p id="email-error" role="alert">Enter a valid email address.</p>
<input aria-invalid="true" aria-describedby="email-error">
```

## Eval 3

```html
<fieldset>
  <legend>Contact method</legend>
  <label><input type="radio" name="method" value="email"> Email</label>
</fieldset>
```

## Eval 4

```html
<label for="dob-day">Day</label>
<input id="dob-day" autocomplete="bday-day">
<label for="dob-month">Month</label>
<input id="dob-month" autocomplete="bday-month">
<label for="dob-year">Year</label>
<input id="dob-year" autocomplete="bday-year">
```

## Eval 5

```html
<label for="zip">ZIP code</label>
<input id="zip" type="text" inputmode="numeric" pattern="[0-9]{5}">
```
