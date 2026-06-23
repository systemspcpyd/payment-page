```mermaid
graph TD
    User[User Clicks Link] --> |"target='formDisplay'"| Router{Browser Engine}
    Router --> |"Updates src"| IFrame[iframe id='left-container']
    IFrame --> |"Loads"| SubDoc[External HTML File]
    SubDoc --> |"Triggers"| Resize[resizeIframe function]
    Resize --> |"Calculates height"| IFrame
