import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../../app.config";
import {RialPipePipe} from "./pipes/rial-pipe.pipe";
import {PersianDatePipe} from "./pipes/persian-date.pipe";
import {heroXMark} from "@ng-icons/heroicons/outline";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {BlurClickDirective} from "../../../directives/blur-click.directive";
import * as d3 from 'd3';
import {FetchDataService} from "../../../services/fetchData/fetch-data.service";

interface Transaction {
  TransactionId: number,
  sourceAccountId: number,
  destinationAccountId: number,
  amount: number,
  date: string,
  type: string
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
  label: string | number;
}

interface Link {
  source: Node;
  target: Node;
  date: string;
  amount: string;
  type: string;
}

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
  providers: [provideIcons({heroXMark})]
})
export class ShowDataComponent {
  user!: User | undefined;
  data: Transaction[] | undefined = undefined;
  nodes: Node[] = [];
  links: Link[] = [];

  @Output() dataGotEvent = new EventEmitter();

  @ViewChild('labelElement') labelElement!: ElementRef<HTMLLabelElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('selectElement') selectElement!: ElementRef<HTMLSelectElement>;
  @ViewChild('dataElement') dataElement!: ElementRef<HTMLDivElement>;
  @ViewChild('graphElement') graphElement!: ElementRef<HTMLDivElement>;
  @ViewChild('contextElement') contextElement!: ElementRef<HTMLDivElement>;

  constructor(private userService: UserService, private http: HttpClient, private fetchDataService: FetchDataService) {
    this.user = this.userService.getUser();
  }

  handleChange(): void {
    if (this?.inputElement?.nativeElement?.files && this?.inputElement?.nativeElement?.files?.length > 0) {
      this.labelElement.nativeElement.textContent = this?.inputElement?.nativeElement?.files[0].name;
    }
  }

  handleDisabled(): boolean {
    return !(this?.inputElement?.nativeElement?.files && this?.inputElement?.nativeElement?.files?.length > 0);
  }

  onSubmit(): void {
    const formData: FormData = new FormData();
    const token: string | null = this.getToken();
    if (this.inputElement.nativeElement.files) {
      const file = this.inputElement.nativeElement.files[0];
      formData.append('file', file);
      if (this.selectElement.nativeElement.value === "transaction") {
        this.http.post(API_BASE_URL + 'transactions/upload', formData, {headers: {"Authorization": "Bearer " + token}}).subscribe((response) => {
          console.log(response);
        })
      } else if (this.selectElement.nativeElement.value === "account") {
        this.http.post(API_BASE_URL + 'accounts/upload', formData, {headers: {"Authorization": "Bearer " + token}}).subscribe((response) => {
          console.log(response);
        })
      }
    }
  }

  showData(): void {
    this.dataElement.nativeElement.style.display = 'flex';
  }

  handleClose(): void {
    this.dataElement.nativeElement.style.display = 'none';
  }

  getToken(): string | null {
    let token = localStorage.getItem("token");
    if (token) {
      token = token.substring(1, token.length - 1);
    }

    return token;
  }

  async ngOnInit() {
    const response = await this.fetchDataService.fetchData();
    this.data = response;
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
    this.dataGotEvent.emit();
  }

  @HostListener('dataGotEvent')
  handleGraph(): void {
    const element = d3.select(this.graphElement.nativeElement)
      .append('svg')
      .attr('width', this.graphElement.nativeElement.clientWidth)
      .attr('height', this.graphElement.nativeElement.clientHeight);


    const svgGroup = element.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    element.call(zoom);

    const simulation = d3.forceSimulation(this.nodes)
      .force("link", d3.forceLink(this.links));

    const link = svgGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#FDFDFD');


    const linkLabelsAmount = svgGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Link) => d.amount ? d.amount : "");

    const linkLabelsType = svgGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Link) => d.type ? d.type : "");

    const linkLabelsDate = svgGroup.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(this.links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Link) => d.date ? d.date : "");

    const node = svgGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', '#002B5B')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
      );

    node.on('contextmenu', (event: MouseEvent, d: Node) => {
      event.preventDefault();

      this.contextElement.nativeElement.style.display = 'flex';
      this.contextElement.nativeElement.style.top = event.clientY + 'px';
      this.contextElement.nativeElement.style.left = event.clientX + 'px';
    });

    const nodeLabels = svgGroup.append('g')
      .attr('class', 'node-labels')
      .selectAll('text')
      .data(this.nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -10) // Position above the node
      .attr('fill', '#172535')
      .attr('style', 'user-select: none;font-weight:bold;font-size:1.5rem;')
      .text((d: Node) => d.label ? d.label : "");

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // Update positions of node labels
      nodeLabels
        .attr('x', d => d.x)
        .attr('y', d => d.y);

      // Update positions of link labels
      linkLabelsAmount
        .attr('x', d => ((d.source as Node).x + (d.target as Node).x) / 2)
        .attr('y', d => ((d.source as Node).y + (d.target as Node).y) / 2);

      linkLabelsDate
        .attr('x', d => ((d.source as Node).x + (d.target as Node).x) / 2)
        .attr('y', d => ((d.source as Node).y + (d.target as Node).y) / 2 + 20);

      linkLabelsType
        .attr('x', d => ((d.source as Node).x + (d.target as Node).x) / 2)
        .attr('y', d => ((d.source as Node).y + (d.target as Node).y) / 2 + 40);
    }

    simulation.on('tick', ticked);

    simulation
      .force('link', d3.forceLink(this.links).id((d, i) => i).distance(250))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(this.graphElement.nativeElement.clientWidth / 2, this.graphElement.nativeElement.clientHeight / 2));

    function dragStarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  handleCloseContext() {
    this.contextElement.nativeElement.style.display = 'none';
  }
}
