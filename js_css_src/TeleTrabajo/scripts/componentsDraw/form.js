const Form = (function () {
    let config;
    let columns;
    let $toDraw;
    const drawFormMain = () => {
        const formMain = `
        <form style="margin: auto;" class="needs-validation" novalidate>
                            <div class="row">
                            </div>
                            </form>
        `;
        return $(formMain);
    }
    const drawSelect = (name, column) => {
        const select = `
        <div class="form-group ${column.class}">
                                    <label for="validationTooltip03">${column.label}</label>
                                    <select class="form-control custom-select" id="${name}" ${column.required && 'required'}>
                                    <option value=""></option>
                                         ${column.options.map(function (option) {
            return `<option value="${option.value}">${option.label}</option>`;
        }).join('')}
                                    </select>
                                    <div class="invalid-tooltip">${column.invalidTooltip}</div>
                                    <div class="valid-tooltip">${column.validTooltip && column.validTooltip}</div>
                                </div>`;
        return select;
    }
    const drawTextField = (name, column) => {
        const textField = `
        <div class="form-group ${column.class}">
                                    <label for="validationTooltip01">${column.label}</label>
                                    <input class="form-control" type="${column.typeTextField ? column.typeTextField : 'text'}" id="${name}" maxlength="${column.maxLength ? column.maxLength : 100}" placeholder="${column.placeholder}" value="${column.initialValue}" ${column.required && 'required'} ${column.disabled && 'disabled'} >
                                    <div class="valid-tooltip">${column.validTooltip && column.validTooltip}</div>
                                </div>`;
        return textField;
    }
    const drawSwitch = (name, column) => {
        const textField = `
 <div class="form-group ${column.class}">
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="${name}">
          <label class="custom-control-label" for="${name}">${column.label}</label>
        </div>
</div>`;
        return textField;
    }
    const drawCaptchaGoogle = (name, column) => {
        const captcha = `
 <div class="form-group ${column.class}">
    <div id="capatcha" class="col col-lg-4 col-md-4 col-sm-12 col-12">
    <script src='https://www.google.com/recaptcha/api.js'></script>
        <form id="captcha">
        <div class="g-recaptcha-outer">
            <div class="g-recaptcha-inner">
                <div class="g-recaptcha" data-theme="light"
                data-sitekey="6LdD1fwUAAAAAC4Le-zEA1FgoVGmkNBNQcgMLAUF"
                ></div>
            </div>
        </div>
        </form>
    </div>
</div>`;
        return captcha;
    }
    const drawButtonSubmit = (labelButton) => {
        const button = `<button id="button" class="btn btn-primary" >${labelButton}</button>`;
        return button;
    }

    const init = (jsonConfig) => {
        config = jsonConfig;
        columns = jsonConfig.columns;
        $toDraw = jsonConfig.toDraw;

        const $formMain = drawFormMain();

        Object.entries(columns).map(([nameKey, column]) => {
            let field;
            switch (column.type) {
                case 'TextField':
                    field = drawTextField(nameKey, column);
                    break;
                case 'DropDown':
                    field = drawSelect(nameKey, column);
                    break;
                case 'Switch':
                    field = drawSwitch(nameKey, column);
                    break;
                case 'CaptchaGoogle':
                    field = drawCaptchaGoogle(nameKey, column);
                    break;
                default :
                    console.log('error type')
                    break;
            }
            $formMain.find('.row').append(field);
        });
        if(jsonConfig.submit !== false) {
            $formMain.append(drawButtonSubmit(jsonConfig.buttonLabel));
        }


        //draw in the page
        $toDraw.html($formMain)

        $formMain.find('#button').click(function (e) {
            e.preventDefault();
            jsonConfig.submit();
        })


    }
    return {
        init: init
    };
})();