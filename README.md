
# Welcome to Magic Potion!

Curology has just created a new product that will revolutionize the skincare industry and we're ready to unveil it to the world. This product is so different and magical that it requires its very own distinct workflow separate from the other Curology products.
This web app gives users a simple form to place orders for this new and exciting product. Because it is in such high demand, users can only purchase it once and can order no more than three bottles. 
This site was built using a React.js front-end and Ruby on Rails back-end 

You can view the deployed site here: 
* Frontend -   https://curology-react.herokuapp.com/
* Backend- https://curology-rails-api.herokuapp.com/


## Frontend Installation 
* React version -- `17.0.2`

* Clone the front-end and run  
	 * `npm install`
	 * `npm start`

## Backend Installation 
* Ruby version -- `Ruby 2.6.1`
* Rails version -- `Rails 6.0.3`
* Postgres version -- `Postgres 12.4`

* Configuration
		`bundle install`
* Database creation & Configuration
		`rails db:setup`
		`rails db:migrate`
* How to run the test suite
		`bundle exec rspec`

## Front-end Description and Future Considerations 
 The Front-end is built with basic React and vanilla CSS. Because the current requirements were fairly straightforward, no styling libraries or state management tools were used in the app at this point in time. 
 Should the application grow and need state to be passed around more flexibly, we would likely need to use a different form of state management such as Redux or hooks and context. 
### Architecture
- The **homepage** houses the order form and magic potion image. 
- The **order-form** component is where the state for this app lives. Additionally, the POST request is housed on this component.
	-  Validations for each input field are done by creating error fields in the state allowing us to validate each field differently and to have unique error text. When the form is submitted, the validations are checked and if there are any errors, the corresponding error field is set in state.  This field causing the error is highlighted with its error message. I also marked all fields as required as a second check to make sure that no field is left empty. If all fields pass the front-end validations, the POST request is sent to the back-end. If the request is not successful, the error message is displayed to the user. If it is, a success message is displayed and the form fields are cleared.
	-  I only did basic validations on the payment information but in a real-world situation, we would want to be much more thorough or integrate with a payment processing system.  
- All fields in this form are trimmed onChange because none of them should have any blank spaces. If we had fields such as "first name last name" we would trim the input at a differnet point than onChange. 
### Future Scaling
- I created a separate **form-input** component. If, as the application grew, we need to have forms in other parts of the application we could easily reuse the component. 
- Similarly, I created a separate c**ustom button** component that can be easily reused throughout the application. 
- Currently, the fetch request has a hardcoded URL. I would want to move this into an environment variable so that I can change the value without having to redeploy the code. Also, it would make the code base neater.

## Back-end Description and Future Considerations 
- To deploy the app to Heroku I had to migrate from using SQLite to Postgres
### Architecture
- The current schema has 3 tables:
	- User 
	- Transaction - "belongs_to" association with User and Payment. i.e Foreign Key to User and Payment is on the Transaction table
	- Payment

The purchase of a magic potion results in the creation of a transaction object. A transaction requires the User and Payment objects. They are built out as separate tables to logically couple the db table and rails models. This would eventually enable user profiles. Additionally, the payments table is also separate in order to allow easier integration with payment APIs.

### Future Scaling 
- As it stands right now, this is a write-heavy system. In the long term, this kind of system would likely have a CDN to serve up the static front end. We would need to use a queue to facilitate background processing. And finally, on the database, we could use a Write master, Read Replica configuration.
- If our users numbers grew, we could add an index on the email column of the users table to enable faster lookup for unique emails.
- I chose to do the unique email validation at the application layer so that eventually we could support things like alias emails and groups.
- Currently, I'm just using rails routing and controllers. Depending on how the product's requirements were to grow we could use more sophisticated API solutions like OpenAPI.
- Ideally, credit card processing would be done through an integration with a payment processing system. At this point in time, I only did basic validations on the payment information but in a real-world situation we would want to be much more thorough. For example, the user can currently enter any date as long as it is in the correct format. In reality, we would likely want to check that the date was not in the past. 
