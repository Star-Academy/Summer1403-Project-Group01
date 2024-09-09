import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../../app.config";
import {RialPipePipe} from "./pipes/rial-pipe.pipe";
import {PersianDatePipe} from "./pipes/persian-date.pipe";
import {heroXMark, heroChevronDown} from "@ng-icons/heroicons/outline";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {BlurClickDirective} from "../../../directives/blur-click.directive";
import * as d3 from 'd3';
import {FetchDataService} from "../../../services/fetchData/fetch-data.service";
import {Account, Link, Transaction, Node} from "../../../interfaces/other";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-show-data',
  standalone: true,
  imports: [
    FormsModule,
    RialPipePipe,
    PersianDatePipe,
    NgIconComponent,
    BlurClickDirective
  ],
  templateUrl: './show-data.component.html',
  styleUrl: './show-data.component.scss',
  providers: [provideIcons({heroXMark, heroChevronDown})]
})
export class ShowDataComponent {
  user!: User | undefined;
  data: Transaction[] | undefined = undefined;
  accountsData: Account[] | undefined = undefined;
  nodes: Node[] = [];
  links: Link[] = [];
  account: Account | undefined = undefined;
  graphRendered = false;
  lastId = 1;
  fileIds: {id: number}[] = [];

  element!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  svgGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  simulation!: d3.Simulation<Node, Link>;
  link!: d3.Selection<SVGLineElement, Link, SVGGElement, unknown>;
  linkLabelsAmount!: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>;
  linkLabelsDate!: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>;
  linkLabelsType!: d3.Selection<SVGTextElement, Link, SVGGElement, unknown>;
  node!: d3.Selection<SVGCircleElement, Node, SVGGElement, unknown>;
  nodeLabels!: d3.Selection<SVGTextElement, Node, SVGGElement, unknown>;

  @ViewChild('labelAccountsElement') labelAccountsElement!: ElementRef<HTMLLabelElement>;
  @ViewChild('labelTransactionsElement') labelTransactionsElement!: ElementRef<HTMLLabelElement>;
  @ViewChild('inputAccountsElement') inputAccountsElement!: ElementRef<HTMLInputElement>;
  @ViewChild('inputTransactionsElement') inputTransactionsElement!: ElementRef<HTMLInputElement>;
  @ViewChild('selectElement') selectElement!: ElementRef<HTMLSelectElement>;
  @ViewChild('dataElement') dataElement!: ElementRef<HTMLDivElement>;
  @ViewChild('graphElement') graphElement!: ElementRef<HTMLDivElement>;
  @ViewChild('contextElement') contextElement!: ElementRef<HTMLDivElement>;
  @ViewChild('searchIdElement') searchIdElement!: ElementRef<HTMLInputElement>;
  @ViewChild('userContainer') userElement!: ElementRef<HTMLDivElement>;
  @ViewChild('accountDataElement') accountDataElement!: ElementRef<HTMLDivElement>;
  @ViewChild('filesElement') filesElement!: ElementRef<HTMLUListElement>;

  constructor(private userService: UserService, private http: HttpClient,
              private fetchDataService: FetchDataService, private toast: ToastrService) {
    this.user = this.userService.getUser();
  }

  handleChange(): void {
    if (this?.inputAccountsElement?.nativeElement?.files && this?.inputAccountsElement?.nativeElement?.files?.length > 0) {
      this.labelAccountsElement.nativeElement.textContent = this?.inputAccountsElement?.nativeElement?.files[0].name;
    }
    if (this?.inputTransactionsElement?.nativeElement?.files && this?.inputTransactionsElement?.nativeElement?.files?.length > 0) {
      this.labelTransactionsElement.nativeElement.textContent = this?.inputTransactionsElement?.nativeElement?.files[0].name;
    }
  }

  handleDisabled(): boolean {
    return (
      !(this?.inputAccountsElement?.nativeElement?.files && this?.inputAccountsElement?.nativeElement?.files?.length > 0)
      || !(this?.inputTransactionsElement?.nativeElement?.files && this?.inputTransactionsElement?.nativeElement?.files?.length > 0)
    );
  }

  handleShowFiles(): void {
    this.filesElement.nativeElement.style.display = 'block';
  }

  closeShowFiles(): void {
    this.filesElement.nativeElement.style.display = 'none';
  }

  clearGraphTable(): void {
    d3.select(this.graphElement.nativeElement).selectAll('*').remove();
  }

  async handleGetUser() {
    this.nodes = [];
    this.links = [];
    if (this.searchIdElement.nativeElement.value === '') {
      await this.getAllData();
      return;
    }
    const response = await this.fetchDataService.fetchDataById(this.searchIdElement.nativeElement.value);
    if (response.length === 0) {
      this.graphElement.nativeElement.textContent = "داده ای یافت نشد!";
      return;
    }
    this.nodes.push({
      x: 1,
      y: 1,
      vx: 1,
      vy: 1,
      label: Number(this.searchIdElement.nativeElement.value)
    });
    for (const item of response) {
      if (!this.nodes.find(node => node.label === item.accountId)) {
        this.nodes.push({
          x: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].x + 1 : 1,
          y: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].y + 1 : 1,
          vx: 1,
          vy: 1,
          label: item.accountId,
        });
      }
      this.links.push({
        source: item.transactionWithSources[0].sourceAcount === item.accountId ?
          this.nodes.find(node => node.label === item.accountId)!
          : this.nodes.find(node => node.label === Number(this.searchIdElement.nativeElement.value))!,
        target: item.transactionWithSources[0].sourceAcount === item.accountId ?
          this.nodes.find(node => node.label === Number(this.searchIdElement.nativeElement.value))!
          : this.nodes.find(node => node.label === item.accountId)!,
        type: item.transactionWithSources[0].type,
        amount: (new RialPipePipe()).transform(item.transactionWithSources[0].amount),
        date: (new PersianDatePipe()).transform(item.transactionWithSources[0].date),
      })
    }
    this.searchIdElement.nativeElement.value = "";
    this.handleGraph();
  }

  onSubmit(): void {
    const formDataAccount: FormData = new FormData();
    const formDataTransaction: FormData = new FormData();
    const token: string | null = this.getToken();
    if (this.inputAccountsElement.nativeElement.files && this.inputTransactionsElement.nativeElement.files) {
      const accountFile = this.inputAccountsElement.nativeElement.files[0];
      const transactionFile = this.inputTransactionsElement.nativeElement.files[0];
      formDataAccount.append('file', accountFile);
      formDataAccount.append('fileId', String(this.lastId))
      formDataTransaction.append('file', transactionFile);
      formDataTransaction.append('fileId', String(this.lastId))
      this.http.post(API_BASE_URL + 'accounts/upload', formDataAccount,
        {headers: {"Authorization": "Bearer " + token, "Accept": "application/json"}})
        .subscribe({
          next: (res) => {
            console.log(res);
            this.http.post(API_BASE_URL + 'transactions/upload', formDataTransaction,
              {headers: {"Authorization": "Bearer " + token, "Accept": "application/json"}})
              .subscribe({
                next: () => {
                  this.lastId++;
                  this.getAllFileIds();
                  this.getAccountsData();
                  this.getAllData();
                  this.toast.success("فایل ها با موفقیت اپلود شدند.");
                }
              });
            },
          error: (error) => {
            if (error.status === 401) {
              this.userService.logout();
              this.toast.error("لطفا مجددا وارد شوید.")
            } else {
              this.toast.error("فایل تکراری است.")
            }
          },
        });
    }
  }

  handleDeleteFile(event: MouseEvent) {
    const token = this.getToken();
    this.http.delete(API_BASE_URL + 'transactions/' + (event.target as HTMLElement).id,
      {headers: {"Authorization": "Bearer " + token, "Accept": "application/json"}}).subscribe({
      next: () => {
        this.http.delete(API_BASE_URL + 'accounts/' + (event.target as HTMLElement).id,
          {headers: {"Authorization": "Bearer " + token, "Accept": "application/json"}}).subscribe({
          next: () => {
            this.fileIds = this.fileIds?.filter(fileId => fileId.id !== Number((event.target as HTMLElement).id));
            this.getAccountsData();
            this.getAllData();
            this.handleGraph();
          },
          error: (error) => {
            if (error.status === 401) {
              this.userService.logout();
              this.toast.error("لطفا مجددا وارد شوید.");
            } else {
              this.toast.error("در اپلود فایل مشکلی به وجود امد.")
            }
          }
        })
      }
    })
  }

  handleUpdateFileData(event: MouseEvent) {
    const token = this.getToken();
    const id = (event.target as HTMLElement).id;
    this.http.get<Account[]>(API_BASE_URL + 'accounts/by-file-id/' + id,
      { headers: { 'Authorization': "Bearer " + token } }).subscribe((response) => {
        this.accountsData = response;
    });
    this.http.get<Transaction[]>(API_BASE_URL + 'transactions/by-file-id/' + id,
      { headers: { 'Authorization': "Bearer " + token } }).subscribe((response) => {
        this.data = response;
        this.nodes = [];
        this.links = [];
        for (const trans of response) {
          if (!this.nodes.find(node => node.label === trans.sourceAccountId)) {
            this.nodes.push({
              x: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].x + 1 : 1,
              y: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].y + 1 : 1,
              vx: 1,
              vy: 1,
              label: trans.sourceAccountId,
            });
          }
          if (!this.nodes.find(node => node.label === trans.destinationAccountId)) {
            this.nodes.push({
              x: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].x + 1 : 1,
              y: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].y + 1 : 1,
              vx: 1,
              vy: 1,
              label: trans.destinationAccountId,
            });
          }
          this.links.push({
            source: this.nodes.find(node => node.label === trans.sourceAccountId)!,
            target: this.nodes.find(node => node.label === trans.destinationAccountId)!,
            date: (new PersianDatePipe()).transform(trans.date),
            type: trans.type,
            amount: (new RialPipePipe()).transform(trans.amount),
          });
        }
    });
  }

  showData(whichData: string): void {
    if (whichData === "transactions") {
      this.dataElement.nativeElement.style.display = 'flex';
    } else {
      this.accountDataElement.nativeElement.style.display = 'flex';
    }
  }

  handleClose(whichData: string): void {
    if (whichData === "accounts") {
      this.accountDataElement.nativeElement.style.display = 'none';
    } else {
      this.dataElement.nativeElement.style.display = 'none';
    }
  }

  getToken(): string | null {
    let token = localStorage.getItem("token");
    if (token) {
      token = token.substring(1, token.length - 1);
    }

    return token;
  }

  async ngOnInit() {
      this.getAllFileIds();
      this.getAccountsData();
      await this.getAllData();
  }

  getAccountsData(): void {
    const token = this.getToken();
    this.http.get<Account[]>(API_BASE_URL + 'accounts', { headers: { 'Authorization': "Bearer " + token } })
      .subscribe((res) => { this.accountsData = res; })
  }

  getAllFileIds(): void {
    const token = this.getToken();
    this.http.get<{id: number}[]>(API_BASE_URL + 'file-ids', { headers: { 'Authorization': "Bearer " + token } })
      .subscribe((res) => {
        this.fileIds = res;
        this.lastId = this.fileIds[this.fileIds.length - 1].id + 1;
      });
  }

  async getAllData(): Promise<void> {
    const response = await this.fetchDataService.fetchData();
    this.data = response;
    this.nodes = [];
    this.links = [];
    for (const trans of response) {
      if (!this.nodes.find(node => node.label === trans.sourceAccountId)) {
        this.nodes.push({
          x: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].x + 1 : 1,
          y: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].y + 1 : 1,
          vx: 1,
          vy: 1,
          label: trans.sourceAccountId,
        });
      }
      if (!this.nodes.find(node => node.label === trans.destinationAccountId)) {
        this.nodes.push({
          x: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].x + 1 : 1,
          y: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].y + 1 : 1,
          vx: 1,
          vy: 1,
          label: trans.destinationAccountId,
        });
      }
      this.links.push({
        source: this.nodes.find(node => node.label === trans.sourceAccountId)!,
        target: this.nodes.find(node => node.label === trans.destinationAccountId)!,
        date: (new PersianDatePipe()).transform(trans.date),
        type: trans.type,
        amount: (new RialPipePipe()).transform(trans.amount),
      });
    }
  }

  handleGraph(): void {
    this.clearGraphTable();
    this.graphRendered = false;
    this.graphElement.nativeElement.textContent = "";
    if (this.nodes.length === 0) {
      this.graphElement.nativeElement.textContent = "داده ای یافت نشد!";
      return;
    }
    this.element = d3.select(this.graphElement.nativeElement)
      .append('svg')
      .attr('width', this.graphElement.nativeElement.clientWidth)
      .attr('height', this.graphElement.nativeElement.clientHeight);

    d3.select(this.graphElement.nativeElement)
      .append('pre')
      .text("برای انحام اعمال خاص بر روی هر راس راست کلیک کنید.\n" +
        "برای گسترش گراف در حالت جستجو شده، باید تا اتمام ساخت گراف\n (رندر و ری-رندر شدن آن) صبر کنید.")
      .attr("style", "" +
        "position: absolute;" +
        "inset-inline-start: 0.25rem;" +
        "inset-block-start: 0.25rem;" +
        "color: #172535;" +
        "z-index: 10;" +
        "font-size: 1.8rem;" +
        "opacity: 0.7;");

    this.svgGroup = this.element.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        this.svgGroup.attr('transform', event.transform);
      });

    this.element.call(zoom);

    this.simulation = d3.forceSimulation(this.nodes)
      .force("link", d3.forceLink(this.links));

    this.svgGroup.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#FDFDFD')
      .style('stroke', 'none');

    this.link = this.svgGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#FDFDFD')
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)');

    this.linkLabelsAmount = this.svgGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Link) => d.amount ? d.amount : "");

    this.linkLabelsType = this.svgGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Link) => d.type ? d.type : "");

    this.linkLabelsDate = this.svgGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Link) => d.date ? d.date : "");

    this.node = this.svgGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', '#002B5B')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          this.graphRendered = false;
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
          if (!event.active) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    this.node.on('contextmenu', (event: MouseEvent, d: Node) => {
      event.preventDefault();

      const token = this.getToken();

      this.http.get<Account>(API_BASE_URL + `accounts/${d.label}`, {headers: {'Authorization': "Bearer " + token}})
        .subscribe((res) => {
        this.account = res;
      });

      this.contextElement.nativeElement.style.display = 'flex';
      this.contextElement.nativeElement.style.top = event.clientY + 'px';
      this.contextElement.nativeElement.style.left = event.clientX + 'px';

      const expandButton = this.contextElement.nativeElement.querySelector('ul > li:nth-child(2)');
      const deleteButton = this.contextElement.nativeElement.querySelector('ul > li:last-child');
      expandButton?.classList.add("disabled");
      deleteButton?.classList.add("disabled");
    });

    this.nodeLabels = this.svgGroup.append('g')
      .attr('class', 'node-labels')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -10)
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Node) => d.label ? d.label : "");

    this.simulation.on('tick', () => {
      this.link
        .attr('x1', (d: Link) => d.source.x)
        .attr('y1', (d: Link) => d.source.y)
        .attr('x2', (d: Link) => d.target.x)
        .attr('y2', (d: Link) => d.target.y);

      this.node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      this.nodeLabels
        .attr('x', d => d.x)
        .attr('y', d => d.y);

      this.linkLabelsAmount
        .attr('x', d => ((d.source as Node).x + (d.target as Node).x) / 2)
        .attr('y', d => ((d.source as Node).y + (d.target as Node).y) / 2);

      this.linkLabelsDate
        .attr('x', d => ((d.source as Node).x + (d.target as Node).x) / 2)
        .attr('y', d => ((d.source as Node).y + (d.target as Node).y) / 2 + 20);

      this.linkLabelsType
        .attr('x', d => ((d.source as Node).x + (d.target as Node).x) / 2)
        .attr('y', d => ((d.source as Node).y + (d.target as Node).y) / 2 + 40);
    });

    this.simulation
      .force('link', d3.forceLink(this.links).id((d, i) => i).distance(250))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(this.graphElement.nativeElement.clientWidth / 2, this.graphElement.nativeElement.clientHeight / 2))
      .on("end", () => {
        this.graphRendered = true;
        const expandButton = this.contextElement.nativeElement.querySelector('ul > li:nth-child(2)');
        expandButton?.classList.remove("disabled");
        const deleteButton = this.contextElement.nativeElement.querySelector('ul > li:last-child');
        deleteButton?.classList.remove("disabled");
      });

  }

  handleCloseContext() {
    this.contextElement.nativeElement.style.display = 'none';
  }

  handleShowUser() {
    this.userElement.nativeElement.style.display = 'flex';
  }

  handleCloseUser() {
    this.userElement.nativeElement.style.display = 'none';
  }

  async handleExpandGraph(): Promise<void> {
    if (!this.graphRendered) return;
    const newData = await this.fetchDataService.fetchDataById(String(this.account?.accountId));
    this.clearGraphTable();
    for (const item of newData) {
      if (!this.nodes.find(node => node.label === item.accountId)) {
        this.nodes.push({
          index: this.nodes.length,
          x: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].x + 1 : 1,
          y: this.nodes[this.nodes.length - 1] ? this.nodes[this.nodes.length - 1].y + 1 : 1,
          vx: 1,
          vy: 1,
          label: item.accountId,
        });
      }
      if (!this.links.find(link => link.source.label === item.accountId && link.target.label === this.account?.accountId) &&
          !this.links.find(link => link.source.label === this.account?.accountId && link.target.label === item.accountId)) {
        this.links.push({
          index: this.links.length,
          source: item.transactionWithSources[0].sourceAcount === item.accountId ?
            this.nodes.find(node => node.label === item.accountId)!
            : this.nodes.find(node => node.label === this.account?.accountId)!,
          target: item.transactionWithSources[0].sourceAcount === item.accountId ?
            this.nodes.find(node => node.label === this.account?.accountId)!
            : this.nodes.find(node => node.label === item.accountId)!,
          type: item.transactionWithSources[0].type,
          amount: (new RialPipePipe()).transform(item.transactionWithSources[0].amount),
          date: (new PersianDatePipe()).transform(item.transactionWithSources[0].date),
        });
      }
    }
    this.handleGraph();
  }

  handleDeleteNode(): void {
    if (!this.graphRendered) return;
    this.nodes = this.nodes.filter(node => node.label !== this.account?.accountId);
    this.links = this.links.filter(link => (link.source.label !== this.account?.accountId)
      && (link.target.label !== this.account?.accountId));
    this.contextElement.nativeElement.style.display = 'none';
    this.handleGraph();
  }
}
