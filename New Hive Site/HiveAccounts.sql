#People
	[SPK]
	Name string

#MembershipLevels
	[LOOKUP]

#MembershipStatus
	fk People
	fk MembershipLevels
	[TSPAN]

#Accounts
	[SPK]
	Name string

#AccountOwners
	fk People
	fk Accounts

#Transactions
	[SPK]
	fk Account ac_from
	fk Account ac_to
	TransDate datetime
	Amount decimal
	
#DuesCharges
	[SPK]
	fk MembershipStatus
	ChargeDate datetime

#DuesPayments
	fk DuesCharges
	fk Transactions
