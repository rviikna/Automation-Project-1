beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})
describe('Visual tests for registration form 3', () => {

    it('Check that radio buttons list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that country dropdown is correct', () => {
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Spain', 'Estonia', 'Austria'])
        })
    })

    it('Check that city dropdown is correct', () => {
        cy.get('#city').should('not.be.enabled')
        cy.get('#country').select(2)
        cy.get('#city').should('be.enabled')

        cy.get('#country').select(0).should('contain', '')
        cy.get('#city').should('not.be.enabled')
        cy.get('#country').select(1).should('contain', 'Spain')
        cy.get('#city').should('be.enabled').should('contain', 'Malaga')
        cy.get('#country').select(2).should('contain', 'Estonia')
        cy.get('#city').should('be.enabled').should('contain', 'Tallinn')
        cy.get('#country').select(3).should('contain', 'Austria')
        cy.get('#city').should('be.enabled').should('contain', 'Vienna')

        cy.get('#country').select(1).should('contain', 'Spain')

        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Malaga', 'Madrid', 'Valencia', 'Corralejo'])
        })

        cy.get('#country').select(2).should('contain', 'Estonia')
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Tallinn', 'Haapsalu', 'Tartu'])
        })
        cy.get('#country').select(3).should('contain', 'Austria')
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Vienna', 'Salzburg', 'Innsbruck'])
        })
        cy.get('#country').select(2).should('contain', 'Estonia')
        cy.get('#city').select(1).should('contain', 'Tallinn')
        cy.get('#country').select(3).should('contain', 'Austria')
        cy.get('#city').should('be.enabled').should('not.contain', 'Tallinn').should('not.be.selected')
    })

    it('Checking that checkboxes are correct', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)

        cy.get('div').nextUntil('#checkboxAlert').children().should('contain', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').next().eq(1).should('contain', 'Accept our cookie policy')

        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')

        cy.get('input[type="checkbox"]').next().eq(1).children().should('have.attr', 'href', 'cookiePolicy.html').click()
        cy.go('back')
        cy.log('Back in registration form 3')
    })

    it('Checking email field has cues for format', () => {
        cy.get('input[name="email"]').type('randomemail')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('be.visible').and('have.text', 'Invalid email address.')
        cy.get('input[name="email"]').clear()
        cy.get('input[name="email"]').type('randomemail@test.com')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('not.be.visible')
    })

    it('Checking that logo source & size is correct.', () => {
        cy.log('Will check logo source and size')
        cy.get('[data-testid="picture"]').should('have.attr', 'src').should('include', 'cerebrum_hub_logo.png')
        cy.get('[data-testid="picture"]').invoke('height').should('be.lessThan', 167)
            .and('be.greaterThan', 165)
        cy.get('[data-testid="picture"]').invoke('width').should('be.lessThan', 179)
            .and('be.greaterThan', 177)     
    })
})

describe('Functional tests for registration form 3', () => {

    it('Checking that user can submit form with all fields filled', () => {
        allFieldsFilled('JohnDoe')
        cy.get('span[ng-show="myForm.email.$error.required"]').should('not.be.visible')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('not.be.visible')
        cy.get('input[onclick="postYourAdd()"]').should('be.enabled')
        cy.get('input[onclick="postYourAdd()"]').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')
        cy.log('Back in registration form 3')
    })
    it('Checking that user can submit form with only mandatory data filled', () => {
        onlyMandatoryFieldsFilled('JohnDoe')

        cy.get('span[ng-show="myForm.email.$error.required"]').should('not.be.visible')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('not.be.visible')

        cy.get('input[onclick="postYourAdd()"]').should('be.enabled')
        cy.get('input[onclick="postYourAdd()"]').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')
        cy.log('Back in registration form 3')
        })

    it('User can not submit form without mandatory field email is filled', () => {
        onlyMandatoryFieldsFilled('JohnDoe')

        cy.get('input[type="email"]').clear()

        cy.get('h2').contains('Birthday').click()
        cy.get('input[onclick="postYourAdd()"]').should('not.be.enabled')

        cy.get('span[ng-show="myForm.email.$error.required"]').should('be.visible')
    })
    it('Files can be uploaded', () => {
        cy.get('#myFile').attachFile(img)
        cy.get('#myFile').next().should('have.text', 'Submit file').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')
        cy.log('Back in registration form 3')
    })
})

const img = 'file3.txt'

function allFieldsFilled(name) {
    cy.get('#name').type(name)
    cy.get('input[type="email"]').type('email@example.com')
    cy.get('#country').select(3)
    cy.get('#city').select(1)
    cy.get('input[type="date"]').eq(0).type('2024-05-09')
    cy.get('#birthday').type('1971-05-09')
    cy.get('input[type="checkbox"]').eq(0).click()
    cy.get('input[type="checkbox"]').eq(1).click()
    cy.get('input[type="radio"]').next().eq(1).click()
    cy.get('#myFile').attachFile(img)
    cy.get('h2').contains('Birthday').click()
}

function onlyMandatoryFieldsFilled(name) {
    cy.get('#name').type(name)
    cy.get('input[type="email"]').type('email@example.com')
    cy.get('#country').select(3)
    cy.get('#city').select(1)
    cy.get('#birthday').type('1971-05-09')
    cy.get('input[type="checkbox"]').eq(0).click()
    cy.get('input[type="checkbox"]').eq(1).click()
    cy.get('h2').contains('Birthday').click()
}
