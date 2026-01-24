--Insert Iron Man
INSERT INTO account(account_firstname, account_lastname, account_email, account_password)
VALUES('Tony', 'Stark', 'tony@satrkent.com', 'Iam1ronM@n');

--Modify the account_type from Client to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

--Delete Tony Stark record
DELETE FROM account 
WHERE account_id = 1;

--Update GM Hummer description from "small interiors" to "a huge interior"
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_make = 'GM' and inv_model = 'Hummer';

--Inner Join for Sport category
SELECT classification_name AS "Classification", inv_make AS "Make", inv_model AS "Model"
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_id = 2;

--Add /vehicles/ to the inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

SELECT inv_image, inv_thumbnail
FROM inventory;