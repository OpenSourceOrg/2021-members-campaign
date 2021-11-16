class memberList extends HTMLElement {
  constructor() {
    super()
    this.i = 0;
  }

  async connectedCallback() {
    // Get the dummy data
    this.members = await this.getMembers();
    this.members.reverse();

    // Get the template from a seperate html file
    this.template = await this.getTemplate();

    // Create a shadow dom for appending elements to
    this.attachShadow({mode: 'open'})

    // create the parent list element
    this.parentList = document.createElement('ul')
    this.parentList.classList.add('member-list')

    // append the created elements to the shadow dom
    this.shadowRoot.append(this.parentList);
    this.addMembersLoop();
  }

  async addMembersLoop() {
    // debugger;
    // Populate members
    const member = this.members[this.i];
    if (this.i < 5) {
      this.addListItem(member, this.template, this.parentList)
      this.i++
      this.addMembersLoop()
    } else if (this.i < this.members.length) {
    setTimeout(() => {
        this.addListItem(member, this.template, this.parentList);
        this.i++
        this.addMembersLoop()
      }, 5000)
    }
  }

  async getMembers() {
    const response = await fetch('/static/js/components/member-list/members.json');
    return response.json().then(data => data)
  }

  async getTemplate() {
    const response = await fetch('/static/js/components/member-list/member-list.html');
    let template = await response.text().then(data => data)
    template = new DOMParser().parseFromString(template, 'text/html')
    .querySelector('template')
    return template.content
  }

  addListItem(obj, srcTemplate, parentElement) {
    const memberTemplate = srcTemplate.cloneNode(true)
    const formattedTime = this.formatTimestamp(obj.time_stamp)

    // populate template
    memberTemplate.querySelector('a').href = `https://twitter.com/${obj.twitter_handle}`
    memberTemplate.querySelector('.name').innerText = obj.name
    if (obj.twitter_handle) memberTemplate.querySelector('.twitter').innerText = `@${obj.twitter_handle}`
    memberTemplate.querySelector('.message').innerText = `"${obj.message}"`
    memberTemplate.querySelector('.time-stamp').innerText = formattedTime

    parentElement.prepend(memberTemplate)
    return
  }

  formatTimestamp(pastTime) {
    const rtf = new Intl.RelativeTimeFormat('en');
    const now = new Date();
    const past = new Date(pastTime);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 24)  return rtf.format(-diffHours, "hour")
    return rtf.format(-diffDays, "day")
  }
}

customElements.define('member-list', memberList);
