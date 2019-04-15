# SC5 Overview

SC5 Syntax

[sc5-styleguide](https://github.com/SC5/sc5-styleguide)

サンプル scss ファイル  
[styleguide-app.scss](https://github.com/SC5/sc5-styleguide/blob/master/lib/app/sass/styleguide-app.scss)


**基本ルール**
    
    // 目次
    //
    // Styleguide N.N.N
    
    
**Styleguide**  
固定  


**N.N.N**  
ナンバリング  

ナンバリング でドキュメントがまとめられます  
ナンバリング は手動で与えます  

## 上部 Tab

ナンバリング N.0.0 が Tab になります
    
    // 目次
    //
    // Styleguide 1.0.0

## Tab 内コンテンツ

ナンバリング 下2桁を元に並びます  

注記必要な場合は `markup:` section へ code example を書きます

**Ex.1**

    // Buttons
    //
    // Button styles used in the styleguide
    //
    // default - Default button
    // .sg-primary - Primary button
    // :disabled - Disabled button
    //
    // markup:
    // <button class="sg {$modifiers}">Button text</button>
    //
    // Styleguide 2.3.0
    button.sg {
    }


**Ex.2**

    // Input boxes
    //
    // Styles for input boxes
    //
    // default - Default input
    // :hover - Hovered input
    // :focus - Focused input
    // :active - Active input
    //
    // markup:
    // <input class="sg {$modifiers}" type="text" value="Default text box">
    // <input class="sg {$modifiers}" type="text" placeholder="Default placeholder">
    // <input class="sg {$modifiers}" type="search" value="Search text box">
    //
    // Styleguide 2.4.0
    input.sg {
    }
