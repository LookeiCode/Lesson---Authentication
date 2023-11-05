ALL NOTES ARE DIRECTLY FROM STANLEY (writing what he says)

# AUTH FLOW
2 important parts of auth flow - register and login
2 pages - one for register, one for login
both will have a field (name, pass, email etc) to register/login

1. user types username/password (UN/PW)
2. user clicks button to register
3. when user clicks button -> makes a fetch call to our express server (the fetch call passes over the UN & PW)


# On your express server you'd need to put the UN/PW combo into your DB
1. Check if username already exists in DB
    - if yes -> "Usernames already taken" (wont register)
    - if no -> It'll create a new user in the DB

2. You would never want to store the raw password in the DB (security risk)
3. Hash the password

# TWO TYPES OF SECURITY
1. Encryption (not gonna cover this now)
2. Hash

Both are very different - do NOT use them interchangeably

# HASHING
- Hashing converts text (typically a password) into a random string of characters/gibberish
- EXAMPLE: tylercode123 --> dsfjsdf2hj2hFESDH@$^VF@@#$4R2

- The same password will always result in the same hash - the output is always the same - the hashed version of the password is always the same every time
- EXAMPLE: tylercode123 (will always equal) --> dsfjsdf2hj2hFESDH@$^VF@@#$4R2
- This is called "deterministic" - which means -> same input always means same output

- Hashing is a one way street - once hashed, you can't un-hash the hash code to get the actual text/password from it
- When you're at the hashed value, you cannot turn it back into the un-hashed value - that's why its so secure

# STORING RAW V.S HASHED PW IN DB (REGISTRATION)

----------------------------
ID   | UN   |  PW  | Email |
----------------------------
   1 |  ty  | 123  |       |
     |      |      |       |
     |      |      |       |
     |      |      |       |
----------------------------

- You are not gonna put "123" into the DB
- You're gonna put the hashed version of "123" into the DB (remember it doesn't matter if anyone sees it because once it's hashed, it cant be reverted to see what the un-hashed version is, aka the password)

EXAMPLE:
123 hashed = sf$g252%5f

-----------------------------------
ID   | UN   |     PW      | Email |
-----------------------------------
   1 |  ty  | sf$g252%5f  |       |
     |      |             |       |
     |      |             |       |
     |      |             |       |
----------------------------

- THIS is how registration works on websites

# HOW LOGGING IN WORKS

---------------------------
|       ------------      |
|       |    UN    |      |
|       ------------      |
|       ------------      |
|       |    PW    |      |
|       ------------      |
|         ---------       |
|         | LOGIN |       |
|         ---------       |
---------------------------

1. User types in UN/PW
2. User clicks login
3. Makes an axios/fetch call to your express server
4. The express server takes the UN & PW and looks for that entry in the DB for that UN

EXAMPLE:
UN - Tyler
PW - tyler123

5. If successfully found it will confirm that yes, this user/entry exists in the db
    - At this point, all you know is that the user/entry exists in the db - (if the entry exists, the UN exists)
    - It has not authenticated the user yet though because we haven't checked for their password, we only checked if the username/user existed in the DB so far
    - Otherwise you'd be able to log in as someone by just knowing their username lol

6. Now we want to make sure the users password is correct also and matches with the username
   (how can we tell if the PW is correct?)

EXAMPLE:
Password is -> tyler123
Hashed PW of tyler123 in DB is -> gfHGt$252%*#^sdg

- When you login it finds the entry for the username
- It then takes the password you entered into the login and hashes it and sees if the hashed version is in the DB with that username too (remember the unhashed version always will output the same hashed version - see L29)

# WHAT IF USERS HAVE THE SAME PASSWORD? (SALT ROUNDS)

- This is where "SALT ROUNDS" comes in
- Salt rounds is how many times/rounds the hashing process runs
- It will hash the original text password (round 1), then it will hash the hash (round 2) and so on

EXAMPLE:        round 1             round 2             round 3          ETC...
tyler123 -> gfHGt$252%*#^sdg -> HoKI*v2&7237sF@^$# -> Sd32#6^@FjO03$ -> 

- This makes it near impossible users will ever have the same PW/hashed PW

# SERVER STUFF
1. When you start the server and go to the localhost page, it's constantly listening to requests from clients
