# Veer Bharat Database Design

## Version
Version: 1.0

## Status
Frozen

## Last Updated
04 August 2026

## Scope
This document defines the MongoDB schema used by the Veer Bharat platform.
It specifies collections, relationships, naming conventions, indexing strategy, and document structure.
It does not contain historical data.

Collections Overview
1. Heroes - Indian warriors, kings, and freedom fighters
2. Historical Periods - Time periods and eras
3. Kingdoms - Ruling kingdoms and empires
4. Dynasties - Royal bloodlines and ruling families
5. Battles - Major battles and conflicts
6. Weapons - Traditional and historical weapons
7. War Animals - War horses, elephants, and significant creatures
8. War Strategies - Guerrilla tactics, battle formations
9. Places - Geographical locations
10. Forts - Fortresses and strongholds
11. Events - Historical events and milestones
12. Memorials - Monuments and memorials
13. Museums - Museums, memorials, and cultural centers
14. Exhibitions - Museum exhibits and galleries
15. Alliances - Military alliances and support relationships
16. Tribes - Tribal communities and their roles
17. Military Commanders - Generals, commanders, and officials
18. Books - Historical texts and chronicles
19. Sources - Historical references and archives
20. Quotes - Famous sayings and proclamations
21. Images - Visual media and artwork

Entity Relationship Diagram 

               HISTORICAL_PERIODS
                      |
                      |
                    HERO
                   / |  \
                  /  |   \
                 /   |    \
           BATTLE   WEAPON  KINGDOM
             |        |        |
             |        |        |
          PLACE   ANIMAL   DYNASTY
             |        |        |
             |        |        |
           FORT   STRATEGY  EVENT
             |        |        |
             |        |        |
         MEMORIAL  ALLIANCE  COMMANDER
             |        |        |
             |        |        |
          MUSEUM   TRIBE    SOURCE
             |        |
             |        |
        EXHIBITION  QUOTE
             |
          IMAGE


1. HISTORICAL PERIODS Collection
Purpose
Store information about historical time periods and eras.

Fields
Field	Type	Required	Description
Period ID	String (PER0001)	Yes	Unique identifier
Name	String	Yes	Period name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Start Year	String	Yes	Approximate start year (e.g., "3000 BCE")
End Year	String	Yes	Approximate end year (e.g., "600 BCE")
Duration	String	No	Duration description
Preceded By	ObjectId	No	Reference to Historical Periods
Succeeded By	ObjectId	No	Reference to Historical Periods
Key Characteristics	Array<String>	No	Defining features
Major Dynasties	Array<ObjectId>	No	Reference to Dynasties
Major Kingdoms	Array<ObjectId>	No	Reference to Kingdoms
Major Heroes	Array<ObjectId>	No	Reference to Heroes
Major Events	Array<ObjectId>	No	Reference to Events
Description	String	Yes	Period description
Significance	String	No	Historical importance
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["ancient", "medieval", "empire"]
Search Fields	Object	No	For enhanced search
Metadata	Object	No	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

Search Fields
json
{
  "searchFields": {
    "keywords": ["keyword1", "keyword2"],
    "nativeSpellings": ["spelling1", "spelling2"],
    "alternateSpellings": ["alt1", "alt2"],
    "aliases": ["alias1", "alias2"]
  }
}
Metadata
json
{
  "metadata": {
    "createdBy": "user123",
    "verifiedBy": "admin456",
    "version": 1
  }
}

Predefined Periods
Period ID	Name	Start Year	End Year
PER0001	Ancient India	3000 BCE	600 BCE
PER0002	Mahajanapada Period	600 BCE	322 BCE
PER0003	Mauryan Period	322 BCE	185 BCE
PER0004	Gupta Period	320 CE	550 CE
PER0005	Early Medieval	550 CE	1200 CE
PER0006	Late Medieval	1200 CE	1526 CE
PER0007	Delhi Sultanate	1206 CE	1526 CE
PER0008	Mughal Period	1526 CE	1857 CE
PER0009	Maratha Confederacy	1674 CE	1818 CE
PER0010	Colonial Period	1757 CE	1947 CE
PER0011	Freedom Movement	1857 CE	1947 CE
PER0012	Independent India	1947 CE	Present

2. HEROES Collection 
Purpose
Store comprehensive information about any Indian hero, warrior, king, or freedom fighter.

Fields
Field	Type	Required	Description
Hero ID	String (HERO0001)	Yes	Unique identifier
Name	String	Yes	Primary name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Title	String	No	Title/designation
Gender	String	Yes	Male/Female/Other
Birth Date	Date	No	Date of birth
Birth Date Accuracy	String	No	Exact/Approximate/Unknown
Death Date	Date	No	Date of death
Death Date Accuracy	String	No	Exact/Approximate/Unknown
Birth Place ID	ObjectId	No	Reference to Places
Death Place ID	ObjectId	No	Reference to Places
Cause of Death	String	No	How they died
Nickname	String	No	Popular nickname
Personality Traits	Array<String>	No	e.g., ["courageous", "patriotic"]
Legacy	String	No	Historical significance
Historical Assessments	Object	No	{historian_name: "quote"}
Biography	String	Yes	Comprehensive biography
Short Description	String	No	Brief summary (100-200 words)
Known For	Array<String>	No	Key achievements/events
Expanded Hero Fields
Field	Type	Required	Description
Occupation	Array<String>	No	King/Warrior/Freedom Fighter/Scholar
Roles	Array<String>	No	Specific roles held
Languages Known	Array<String>	No	Languages spoken
Education	String	No	Educational background
Religion	String	No	Religious affiliation (optional)
Coronation Date	Date	No	Date of coronation
Successor ID	ObjectId	No	Reference to Heroes
Predecessor ID	ObjectId	No	Reference to Heroes
Official Seal Image ID    ObjectId    No    Reference to Images (official seal)
Coins	Array<String>	No	Coin descriptions
Administrative Reforms	Array<String>	No	Major administrative changes
Economic Reforms	Array<String>	No	Major economic policies
Family
Field	Type	Required	Description
Father ID	ObjectId	No	Reference to Heroes
Mother ID	ObjectId	No	Reference to Heroes
Brothers	Array<ObjectId>	No	Reference to Heroes
Sisters	Array<ObjectId>	No	Reference to Heroes
Spouse IDs	Array<ObjectId>	No	Reference to Heroes
Children IDs	Array<ObjectId>	No	Reference to Heroes
Dynasty ID	ObjectId	No	Reference to Dynasties
Clan	String	No	Clan/lineage name
Military
Field	Type	Required	Description
Primary Weapon IDs	Array<ObjectId>	No	Reference to Weapons
Preferred Weapons	Array<ObjectId>	No	Reference to Weapons
War Animal ID	ObjectId	No	Reference to War Animals
Army Size	Number	No	Number of soldiers
Commander Of	Array<ObjectId>	No	Reference to Battles
War Strategy IDs	Array<ObjectId>	No	Reference to War Strategies
Military Tactics	Array<String>	No	Description of tactics used
Notable Feats	Array<String>	No	Specific military achievements
Rank	String	No	Military rank/position
Political
Field	Type	Required	Description
Kingdom ID	ObjectId	Yes	Reference to Kingdoms
Capital ID	ObjectId	No	Reference to Places
Reign Period	String	No	Duration of rule
Territory Controlled	Array<ObjectId>	No	Reference to Places
Territories Lost	Array<ObjectId>	No	Reference to Places
Territories Recaptured	Array<ObjectId>	No	Reference to Places
Historical Period ID	ObjectId	No	Reference to Historical Periods
Cross References
Field	Type	Required	Description
Related Heroes	Array<ObjectId>	No	Reference to related Heroes
Related Battles	Array<ObjectId>	No	Reference to Battles
Related Places	Array<ObjectId>	No	Reference to Places
Related Books	Array<ObjectId>	No	Reference to Books
Related Sources	Array<ObjectId>	No	Reference to Sources
Related Images	Array<ObjectId>	No	Reference to Images
Content
Field	Type	Required	Description
Achievements	Array<String>	No	Major achievements
Quotes IDs	Array<ObjectId>	No	Reference to Quotes
Image IDs	Array<ObjectId>	No	Reference to Images
Museum ID	ObjectId	No	Reference to Museums
Exhibition IDs	Array<ObjectId>	No	Reference to Exhibitions
Memorial ID	ObjectId	No	Reference to Memorials
Book IDs	Array<ObjectId>	No	Reference to Books
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["rajput", "warrior", "mewar"]
Search Fields
Field	Type	Required	Description
Search Fields	Object	No	Enhanced search capabilities
Metadata
Field	Type	Required	Description
Metadata	Object	Yes	Document metadata
Status
Field	Type	Required	Description
Status	String	Yes	Draft/Verified/Published/Needs Review
Search Fields Structure
json
{
  "searchFields": {
    "keywords": ["keyword1", "keyword2"],
    "nativeSpellings": ["spelling1", "spelling2"],
    "alternateSpellings": ["alt1", "alt2"],
    "aliases": ["alias1", "alias2"]
  }
}
Metadata Structure
json
{
  "metadata": {
    "createdBy": "user123",
    "verifiedBy": "admin456",
    "version": 1
  }
}

3. KINGDOMS Collection
Purpose

Store information about Indian kingdoms and empires.

Fields
Field	Type	Required	Description
Kingdom ID	String (KGD0001)	Yes	Unique identifier
Name	String	Yes	Kingdom name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Established Date	Date	No	Date kingdom was established
Established Date Accuracy	String	No	Exact / Approximate / Unknown
Dissolved Date	Date	No	Date kingdom ended
Dissolved Date Accuracy	String	No	Exact / Approximate / Unknown
Capital ID	ObjectId	No	Reference to Places
Dynasty ID	ObjectId	Yes	Reference to Dynasties
Founder ID	ObjectId	No	Reference to Heroes
Last Ruler ID	ObjectId	No	Reference to Heroes
Area	String	No	Territorial extent
Flag Image ID	ObjectId	No	Reference to Images (Kingdom flag)
Emblem Image ID	ObjectId	No	Reference to Images (Kingdom emblem)
Government Type	String	No	Monarchy / Republic / Confederacy / etc.
Currencies	Array<String>	No	Currencies used by the kingdom
Official Languages	Array<String>	No	Official language(s)
Official Religions	Array<String>	No	Official religion(s)
National Animal	String	No	National animal
National Symbols	Array<String>	No	National symbol(s)
Major Cities	Array<ObjectId>	No	Reference to Places
Major Forts	Array<ObjectId>	No	Reference to Forts
Historical Period ID	ObjectId	No	Reference to Historical Periods
Description	String	Yes	Historical description
Significance	String	No	Historical importance
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["rajput", "empire", "medieval"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft / Verified / Published / Needs Review
Cross References Structure
{
  "crossReferences": {
    "relatedHeroes": ["HERO0001", "HERO0002"],
    "relatedBattles": ["BAT0001"],
    "relatedPlaces": ["PLC0001", "PLC0002"],
    "relatedBooks": ["BOK0001"]
  }
}

4. BATTLES Collection 
Purpose
Store comprehensive information about historical battles.

Fields
Field	Type	Required	Description
Battle ID	String (BAT0001)	Yes	Unique identifier
Name	String	Yes	Battle name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Battle Date	Date	No	Date of battle
Battle Date Accuracy	String	No	Exact / Approximate / Unknown
Location ID	ObjectId	Yes	Reference to Places
Historical Period ID	ObjectId	No	Reference to Historical Periods
Kingdom IDs	Array<ObjectId>	Yes	Reference to Kingdoms involved
Commander IDs	Array<ObjectId>	Yes	Reference to Heroes
Opposing Commander IDs	Array<ObjectId>	No	Reference to Military Commanders
Victor ID	ObjectId	No	Reference to Heroes/Kingdoms
Casualties	Number	No	Estimated casualties
Army Sizes	Object	No	{kingdomId: count}
Weapons Used	Array<ObjectId>	No	Reference to Weapons
War Animal IDs	Array<ObjectId>	No	Reference to War Animals
Strategy ID	ObjectId	No	Reference to War Strategies
Key Events	Array<String>	No	Important moments
Significance	String	No	Historical importance
Description	String	Yes	Battle description
Aftermath	String	No	What happened after
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["rajput", "mughal", "decisive"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review
Cross References Structure
json
{
  "crossReferences": {
    "relatedHeroes": ["HERO0001", "HERO0002"],
    "relatedPlaces": ["PLC0001"],
    "relatedBooks": ["BOK0001"],
    "relatedSources": ["SRC0001"],
    "relatedImages": ["IMG0001"]
  }
}

5. EVENTS Collection (Final with On This Day Feature)
Purpose
Store important historical events.

Fields
Field	Type	Required	Description
Event ID	String (EVT0001)	Yes	Unique identifier
Name	String	Yes	Event name
Native Name	String	No	Name in native language
Event Date	Date	No	Date of event
Event Date Accuracy	String	No	Exact / Approximate / Unknown
Location ID	ObjectId	No	Reference to Places
Hero IDs	Array<ObjectId>	No	Reference to Heroes
Historical Period ID	ObjectId	No	Reference to Historical Periods
Type	String	Yes	Coronation/Birth/Death/Treaty/Victory/Defeat/Hiding/Prophecy/Battle
Is On This Day Eligible	Boolean	Yes	Whether event appears on "On This Day" feature
Description	String	Yes	Event description
Significance	String	No	Historical importance
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["coronation", "victory", "battle"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review
Cross References Structure
json
{
  "crossReferences": {
    "relatedHeroes": ["HERO0001"],
    "relatedPlaces": ["PLC0001"],
    "relatedBattles": ["BAT0001"],
    "relatedBooks": ["BOK0001"]
  }
}

6. WEAPONS Collection 
Purpose
Store information about historical weapons.

Fields
Field	Type	Required	Description
Weapon ID	String (WPN0001)	Yes	Unique identifier
Name	String	Yes	Weapon name
Native Name	String	No	Name in native language
Category	String	Yes	Sword/Spear/Shield/Bow/Arrow/Armour/Firearm
Sub-Category	String	No	Specific type (e.g., Khanda, Talwar, Bhala)
Material	String	No	Material composition
Weight	String	No	Approximate weight
Length	String	No	Approximate length
Origin	String	No	Place of origin
Effective Range	String	No	Range of effectiveness
Manufacturing Method	String	No	How it was made
Era Used	ObjectId	No	Reference to Historical Periods
Replica Exists	Boolean	No	Whether replica exists
Museum Availability	Array<ObjectId>	No	Reference to Museums
Associated Heroes	Array<ObjectId>	No	Reference to Heroes
Associated Kingdoms	Array<ObjectId>	No	Reference to Kingdoms
Used In Battles	Array<ObjectId>	No	Reference to Battles
Special Features	Array<String>	No	Unique characteristics
Description	String	Yes	Weapon description
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["sword", "medieval", "rajput"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

7. IMAGES Collection 
Purpose
Store image metadata and assets.

Fields
Field	Type	Required	Description
Image ID	String (IMG0001)	Yes	Unique identifier
Title	String	Yes	Image title
URL	String	Yes	Image storage path
Alt Text	String	Yes	Accessibility text
Image Type	String	Yes	Painting/Portrait/Photograph/Statue/Map/Coin/Weapon/Inscription/Fort/Manuscript
Description	String	No	Image description
Artist	String	No	Creator/painter
Period	String	No	Time period depicted
License	String	No	License type (e.g., CC BY-NC, Public Domain)
Copyright	String	No	Copyright holder
Photographer	String	No	Photographer name
Painting	Boolean	No	Whether it's a painting
AI Generated	Boolean	No	Whether AI generated
Restored	Boolean	No	Whether image is restored
Year Created	String	No	Year image was created
Tags	Array<String>	No	Search tags
Source ID	ObjectId	No	Reference to Sources
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review
Cross References Structure
json
{
  "crossReferences": {
    "relatedHeroes": ["HERO0001"],
    "relatedPlaces": ["PLC0001"],
    "relatedBattles": ["BAT0001"]
  }
}

8. SOURCES Collection 
Purpose
Store historical sources and references.

Fields
Field	Type	Required	Description
Source ID	String (SRC0001)	Yes	Unique identifier
Title	String	Yes	Source title
Type	String	Yes	Book/Research Paper/Government Record/ASI/Museum/Archive/Inscription/Travel Account/Chronicle/Manuscript
Author	String	No	Author name
Language	String	No	Source language
Year	String	No	Year of origin
Publisher	String	No	Publisher name
Edition	String	No	Edition number
ISBN	String	No	ISBN number
Pages	Number	No	Number of pages
Volume	String	No	Volume number
Publication Year	String	No	Year of publication
Description	String	Yes	Source description
Reliability	String	No	High/Medium/Low
Location	String	No	Archive location
URL	String	No	Online access link
Tags	Array<String>	No	e.g., ["chronicle", "sanskrit", "primary"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

9. BOOKS Collection 
Purpose
Store historical texts and chronicles.

Fields
Field	Type	Required	Description
Book ID	String (BOK0001)	Yes	Unique identifier
Title	String	Yes	Book title
Book Type	String	Yes	Biography/Chronicle/Research/Travel Account/Archaeology/Inscription Study/Government Publication
Author	String	No	Author name
Language	String	No	Original language
Period	String	No	Time period written
Description	String	Yes	Book description
Subjects	Array<String>	No	Topics covered
Heroes Mentioned	Array<ObjectId>	No	Reference to Heroes
Battles Mentioned	Array<ObjectId>	No	Reference to Battles
PDF URL	String	No	Digital copy link
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["history", "rajput", "research"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

10. PLACES Collection 
Purpose
Store geographical locations.

Fields
Field	Type	Required	Description
Place ID	String (PLC0001)	Yes	Unique identifier
Name	String	Yes	Place name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Type	String	Yes	City/Village/Fort/Hill/Valley/Pass/Canal/River
Coordinates	Object	No	{latitude, longitude}
State	String	No	State/Province
Country	String	No	Country
Region	String	No	Historical region
Significance	String	No	Historical importance
Description	String	No	Place description
Historical Period ID	ObjectId	No	Reference to Historical Periods
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	No	Reference to Sources
Tags	Array<String>	No	e.g., ["city", "fort", "historical"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

11. FORTS Collection 
Purpose
Store information about historical forts.

Fields
Field	Type	Required	Description
Fort ID	String (FRT0001)	Yes	Unique identifier
Name	String	Yes	Fort name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Location ID	ObjectId	Yes	Reference to Places
Construction Date	Date	No	Construction date
Construction Date Accuracy	String	No	Exact / Approximate / Unknown
Builder ID	ObjectId	No	Reference to Heroes
Kingdom ID	ObjectId	No	Reference to Kingdoms
Architecture Style	String	No	Architectural style
Features	Array<String>	No	Notable features
Battles	Array<ObjectId>	No	Reference to Battles
Status	String	No	Active/Ruins/Restored
Description	String	Yes	Fort description
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["fort", "rajput", "heritage"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

12. WAR ANIMALS Collection 
Purpose
Store information about war animals.

Fields
Field	Type	Required	Description
Animal ID	String (ANM0001)	Yes	Unique identifier
Name	String	Yes	Animal name
Type	String	Yes	Horse/Elephant/Camel/Dog
Breed/Species	String	No	Scientific species
Owner ID	ObjectId	Yes	Reference to Heroes
Kingdom ID	ObjectId	No	Reference to Kingdoms
Special Abilities	Array<String>	No	Extraordinary traits
Disguise Details	Object	No	{disguise: "description", purpose: "why"}
Notable Battles IDs	Array<ObjectId>	No	Reference to Battles
Armour ID	ObjectId	No	Reference to Weapons
Fate	String	No	What happened to the animal
Memorial ID	ObjectId	No	Reference to Memorials
Description	String	Yes	Animal description
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["horse", "warrior", "legendary"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

13. WAR STRATEGIES Collection 
Purpose
Store information about military tactics and war strategies.

Fields
Field	Type	Required	Description
Strategy ID	String (STR0001)	Yes	Unique identifier
Name	String	Yes	Strategy name
Native Name	String	No	Name in native language
Type	String	Yes	Guerrilla/Conventional/Terrain-based/Deception/Psychological
Key Principles	Array<String>	No	Core tactical principles
Used By	Array<ObjectId>	No	Reference to Heroes
Used In Battles	Array<ObjectId>	No	Reference to Battles
Description	String	Yes	Detailed description
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["guerrilla", "tactics", "military"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

14. MEMORIALS Collection 
Purpose
Store information about memorials and monuments.

Fields
Field	Type	Required	Description
Memorial ID	String (MEM0001)	Yes	Unique identifier
Name	String	Yes	Memorial name
Native Name	String	No	Name in native language
Type	String	Yes	Smarak/Chatri/Monument/Tourist Attraction/Museum
Location ID	ObjectId	Yes	Reference to Places
Dedicated To	Array<ObjectId>	No	Reference to Heroes/Animals
Built By	ObjectId	No	Reference to Heroes
Year Built	String	No	Year of construction
Description	String	Yes	Memorial description
Significance	String	No	Historical importance
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	No	Reference to Sources
Tags	Array<String>	No	e.g., ["memorial", "smarak", "heritage"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

15. MUSEUMS Collection 
Purpose
Store information about museums and cultural centers.

Fields
Field	Type	Required	Description
Museum ID	String (MUS0001)	Yes	Unique identifier
Name	String	Yes	Museum name
Native Name	String	No	Name in native language
Location ID	ObjectId	Yes	Reference to Places
Type	String	Yes	Museum/Memorial/Cultural Center
Dedicated To	Array<ObjectId>	No	Reference to Heroes
Description	String	Yes	Museum description
Highlights	Array<String>	No	Key attractions
Opening Hours	String	No	Timings
Entry Fee	String	No	Cost information
Website	String	No	Official website
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	No	Reference to Sources
Tags	Array<String>	No	e.g., ["museum", "heritage", "exhibition"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

16. EXHIBITIONS Collection 
Purpose
Store information about museum exhibits.

Fields
Field	Type	Required	Description
Exhibition ID	String (EXH0001)	Yes	Unique identifier
Name	String	Yes	Exhibition name
Description	String	Yes	Exhibition description
Museum ID	ObjectId	Yes	Reference to Museums
Hero IDs	Array<ObjectId>	No	Reference to Heroes
Theme	String	No	Exhibition theme
Image IDs	Array<ObjectId>	No	Reference to Images
Tags	Array<String>	No	e.g., ["exhibition", "gallary", "display"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

17. ALLIANCES Collection 
Purpose
Store information about military alliances.

Fields
Field	Type	Required	Description
Alliance ID	String (ALL0001)	Yes	Unique identifier
Name	String	Yes	Alliance name
Type	String	Yes	Military/Tribal/Family/Political
Parties	Array<ObjectId>	No	Reference to Heroes/Tribes
Description	String	Yes	Description of alliance
Notable Contributions	Array<String>	No	Specific contributions
Source IDs	Array<ObjectId>	No	Reference to Sources
Tags	Array<String>	No	e.g., ["alliance", "military", "tribal"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

18. TRIBES Collection 
Purpose
Store information about tribal communities.

Fields
Field	Type	Required	Description
Tribe ID	String (TRI0001)	Yes	Unique identifier
Name	String	Yes	Tribe name
Native Name	String	No	Name in native language
Region	String	No	Geographical region
Historical Role	String	No	Role in history
Alliances	Array<ObjectId>	No	Reference to Alliances
Description	String	Yes	Tribe description
Source IDs	Array<ObjectId>	No	Reference to Sources
Tags	Array<String>	No	e.g., ["tribe", "indigenous", "warrior"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

19. MILITARY COMMANDERS Collection 
Purpose
Store information about commanders, generals, and officials.

Fields
Field	Type	Required	Description
Commander ID	String (CMD0001)	Yes	Unique identifier
Name	String	Yes	Commander name
Title	String	No	Official title
Role	String	Yes	Commander/Officer/Vassal/General
Kingdom ID	ObjectId	Yes	Reference to Kingdoms
Allegiance	String	No	Which side they fought for
Relationship	String	No	e.g., "Emperor's relative"
Notable Battles	Array<ObjectId>	No	Reference to Battles
Description	String	Yes	Historical description
Image IDs    Array<ObjectId>    No    Reference to Images
Source IDs	Array<ObjectId>	No	Reference to Sources
Tags	Array<String>	No	e.g., ["general", "commander", "mughal"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

20. QUOTES Collection 
Purpose
Store famous quotes and sayings.

Fields
Field	Type	Required	Description
Quote ID	String (QUT0001)	Yes	Unique identifier
Text	String	Yes	Quote content
Language	String	No	Original language
Translation	String	No	English translation
Context	String	No	Quote context
Hero ID	ObjectId	No	Reference to Heroes
Event ID	ObjectId	No	Reference to Events
Source ID	ObjectId	No	Reference to Sources
Tags	Array<String>	No	e.g., ["inspirational", "warrior", "quote"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

21. DYNASTIES Collection 
Purpose
Store information about royal dynasties.

Fields
Field	Type	Required	Description
Dynasty ID	String (DYN0001)	Yes	Unique identifier
Name	String	Yes	Dynasty name
Native Name	String	No	Name in native language
Alternative Names	Array<String>	No	Other known names
Origin	String	No	Origin story
Founder ID	ObjectId	No	Reference to Heroes
Kingdom ID	ObjectId	No	Reference to Kingdoms
Famous Rulers	Array<ObjectId>	No	Reference to Heroes
Description	String	Yes	Historical description
Historical Period ID	ObjectId	No	Reference to Historical Periods
Image IDs	Array<ObjectId>	No	Reference to Images
Source IDs	Array<ObjectId>	Yes	Reference to Sources
Tags	Array<String>	No	e.g., ["rajput", "dynasty", "royal"]
Cross References	Object	No	Related entities
Search Fields	Object	No	Enhanced search
Metadata	Object	Yes	Document metadata
Status	String	Yes	Draft/Verified/Published/Needs Review

ID Conventions
Collection	Prefix	Pattern
Heroes	HERO	HERO0001
Historical Periods	PER	PER0001
Kingdoms	KGD	KGD0001
Dynasties	DYN	DYN0001
Battles	BAT	BAT0001
Weapons	WPN	WPN0001
Places	PLC	PLC0001
Forts	FRT	FRT0001
War Animals	ANM	ANM0001
War Strategies	STR	STR0001
Events	EVT	EVT0001
Memorials	MEM	MEM0001
Museums	MUS	MUS0001
Exhibitions	EXH	EXH0001
Alliances	ALL	ALL0001
Tribes	TRI	TRI0001
Military Commanders	CMD	CMD0001
Books	BOK	BOK0001
Sources	SRC	SRC0001
Quotes	QUT	QUT0001
Images	IMG	IMG0001
Naming Conventions
Collections
Plural: heroes, kingdoms, battles

CamelCase for multi-word: warAnimals, militaryCommanders

Fields
camelCase: birthDate, kingdomId

IDs: Always use {entity}Id pattern (e.g., heroId, kingdomId)

Arrays: Plural naming (e.g., weaponIds, imageIds)

Documents
Each document must have a unique ID field

Reference fields should store IDs, not embedded documents

Use ISO 8601 for dates (YYYY-MM-DD)

All text should support Unicode (Devanagari, Arabic, etc.)

Relationship Summary (Complete)
Collection	References	Referenced By
Heroes	Places, Heroes, Dynasties, Weapons, War Animals, Battles, Kingdoms, War Strategies, Quotes, Images, Museums, Exhibitions, Memorials, Sources, Historical Periods, Books	Heroes, Kingdoms, Dynasties, Battles, War Animals, Events, Books, Museums, Exhibitions, Alliances, Memorials, Military Commanders, Sources, Images, Quotes, Places, Forts
Historical Periods	Dynasties, Kingdoms, Heroes, Events, Sources, Images	Heroes, Kingdoms, Battles, Dynasties, Events, Weapons
Kingdoms	Places, Dynasties, Heroes, Images, Sources, Historical Periods, Forts	Heroes, Battles, War Animals, Events, Forts, Military Commanders, Dynasties
Dynasties	Heroes, Kingdoms, Images, Sources, Historical Periods	Heroes, Kingdoms
Battles	Places, Kingdoms, Heroes, Weapons, War Animals, War Strategies, Military Commanders, Images, Sources, Historical Periods	Heroes, Forts, War Animals, Weapons, Military Commanders, Events, Books
Weapons	Heroes, Kingdoms, Battles, Images, Sources, Historical Periods, Museums	Heroes, Battles, War Animals
War Animals	Heroes, Kingdoms, Battles, Weapons, Memorials, Images, Sources	Heroes, Battles
War Strategies	Heroes, Battles, Images, Sources	Heroes, Battles
Places	Images, Sources, Historical Periods	Heroes, Kingdoms, Battles, Events, Forts, Museums, Memorials, Books, Sources, Images
Forts	Places, Heroes, Kingdoms, Battles, Images, Sources	Kingdoms
Events	Places, Heroes, Images, Sources, Historical Periods	Quotes, Historical Periods
Memorials	Places, Heroes, Animals, Images, Sources	Heroes, War Animals
Museums	Places, Heroes, Images, Sources, Weapons	Exhibitions, Weapons
Exhibitions	Museums, Heroes, Images	-
Alliances	Heroes, Tribes, Sources	Tribes
Tribes	Alliances, Sources	Alliances
Military Commanders	Kingdoms, Battles, Sources	Battles
Books	Heroes, Battles, Images, Sources	Heroes, Kingdoms, Battles, Events, Dynasties, Sources
Sources	-	All collections
Quotes	Heroes, Events, Sources	Heroes
Images	Sources, Historical Periods	All collections


# Index Strategy

To improve query performance, the following indexes are recommended.

## Unique Indexes

- heroId
- periodId
- kingdomId
- dynastyId
- battleId
- weaponId
- animalId
- strategyId
- placeId
- fortId
- eventId
- memorialId
- museumId
- exhibitionId
- allianceId
- tribeId
- commanderId
- bookId
- sourceId
- quoteId
- imageId

## Search Indexes

### Heroes
- name
- alternativeNames
- historicalPeriodId
- kingdomId
- tags

### Historical Periods
- name
- startYear
- endYear

### Kingdoms
- name
- historicalPeriodId

### Battles
- name
- date
- locationId
- commanderIds

### Events
- date
- heroIds
- historicalPeriodId
- isOnThisDayEligible

### Places
- name
- state
- region

### Books
- title
- author

### Sources
- title
- author

### Images
- imageType
- tags


Database Features
✅ On This Day Feature

isOnThisDayEligible field in Events

Query by month and day

Shows relevant historical events

---

✅ Historical Date Accuracy

birthDate + birthDateAccuracy

deathDate + deathDateAccuracy

eventDate + eventDateAccuracy

battleDate + battleDateAccuracy

establishedDate + establishedDateAccuracy

dissolvedDate + dissolvedDateAccuracy

constructionDate + constructionDateAccuracy

Accuracy Values:

- Exact
- Approximate
- Unknown

✅ Image Types
imageType field in Images

Types: Painting, Portrait, Photograph, Statue, Map, Coin, Weapon, Inscription, Fort, Manuscript

✅ Book Types
bookType field in Books

Types: Biography, Chronicle, Research, Travel Account, Archaeology, Inscription Study, Government Publication

✅ Tags Everywhere
tags array in all collections

Enables recommendations and related content

✅ Search Optimization
searchFields with keywords, native spellings, alternate spellings, aliases

Multi-language search support

✅ Cross References
crossReferences object in all collections

Connects related entities automatically

✅ Content Management
status field: Draft, Verified, Published, Needs Review

Mongoose timestamps (createdAt, updatedAt) with metadata for authorship, verification, and versioning

Document Status
Approved

Schema Version
1.1
