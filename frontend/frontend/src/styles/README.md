# 🎨 Structura SCSS

## 📁 Fișiere create

### Fișiere globale (în `src/styles/`)
- **`_variables.scss`** - Variabile globale (culori, spacing, font-sizes, etc.)
- **`_mixins.scss`** - Mixins reutilizabile (flexbox, buttons, inputs, etc.)

### Fișiere per pagină (în `src/pages/`)
- **`Home.scss`** - Stiluri pentru pagina principală (/)
- **`Login.scss`** - Stiluri pentru pagina de login (/login)
- **`Admin.scss`** - Stiluri pentru pagina de admin (/admin)

## 🚀 Cum să folosești

### 1. Variabilele sunt deja importate în fiecare fișier SCSS

```scss
// Poți folosi direct variabilele:
.my-class {
  color: $primary-color;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  box-shadow: $shadow-sm;
}
```

### 2. Mixins-urile sunt disponibile

```scss
// Exemplu de folosire a mixins-urilor:
.my-button {
  @include button-base;
  background-color: $primary-color;
  color: white;
}

.my-input {
  @include input-base;
}

.my-card {
  @include card;
}

.centered-content {
  @include flex-center;
}
```

### 3. Responsive design

```scss
.my-element {
  width: 100%;
  
  @include tablet {
    width: 50%;
  }
  
  @include desktop {
    width: 33.33%;
  }
}
```

## 📝 Variabile disponibile

### Culori
- `$primary-color`, `$secondary-color`, `$success-color`, `$danger-color`
- `$warning-color`, `$info-color`, `$light-color`, `$dark-color`
- `$text-primary`, `$text-secondary`, `$text-muted`
- `$bg-primary`, `$bg-secondary`, `$bg-dark`

### Spacing
- `$spacing-xs` (5px)
- `$spacing-sm` (10px)
- `$spacing-md` (15px)
- `$spacing-lg` (20px)
- `$spacing-xl` (30px)
- `$spacing-xxl` (40px)

### Border Radius
- `$border-radius-sm` (4px)
- `$border-radius-md` (8px)
- `$border-radius-lg` (12px)

### Shadows
- `$shadow-sm`, `$shadow-md`, `$shadow-lg`

### Font Sizes
- `$font-size-sm` (14px)
- `$font-size-md` (16px)
- `$font-size-lg` (18px)
- `$font-size-xl` (24px)
- `$font-size-xxl` (32px)

## 💡 Tips

1. **Stilurile inline** din fișierele JSX sunt păstrate - poți să le înlocuiești treptat cu clase SCSS
2. **Fiecare pagină** are propriul fișier SCSS - scrie stilurile acolo
3. **Variabilele** te ajută să menții consistența culorilor și spacing-ului
4. **Mixins-urile** te ajută să eviți duplicarea codului

## 🎯 Exemplu complet

```scss
// În Home.scss
.home {
  min-height: 100vh;
  background-color: $bg-secondary;
}

.home-header {
  @include flex-between;
  background-color: $bg-dark;
  color: white;
  padding: $spacing-lg;
  
  h1 {
    margin: 0;
    font-size: $font-size-xxl;
  }
}

.news-article {
  @include card;
  margin-bottom: $spacing-lg;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  h3 {
    color: $text-primary;
    margin-top: 0;
  }
  
  p {
    color: $text-secondary;
    line-height: 1.6;
  }
}
```

## 🔄 Cum să înlocuiești stilurile inline

1. Adaugă clase în JSX:
```jsx
<div className="home-header">
  <h1>Titlu</h1>
</div>
```

2. Scrie stilurile în SCSS:
```scss
.home-header {
  background-color: $bg-dark;
  padding: $spacing-lg;
}
```

3. Șterge stilurile inline din JSX

