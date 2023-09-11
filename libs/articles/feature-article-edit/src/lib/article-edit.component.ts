import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '@realworld/core/forms';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { articleActions, articleEditActions, articleQuery } from '@realworld/articles/data-access';

const structure: Field[] = [
  {
    title: 'Article Title',
    type: 'INPUT',
    name: 'title',
    placeholder: 'Enter a cool & snappy title',
    validator: [Validators.required],
  },
  {
    title: 'Description',
    type: 'INPUT',
    name: 'description',
    placeholder: 'Enter a one sentence summary of the article',
    validator: [Validators.required],
  },
  {
    title: 'Article',
    type: 'TEXTAREA',
    name: 'body',
    placeholder: 'Write your article',
    validator: [Validators.required],
  },
  {
    title: 'Tags',
    type: 'INPUT',
    name: 'tagList',
    placeholder: 'Enter Tags',
    validator: [],
  },
  {
    title: 'Co-authors',
    type: 'INPUT',
    name: 'coAuthors',
    placeholder: 'Add co-authors',
    validator: [],
  },
];

@UntilDestroy()
@Component({
  selector: 'cdt-article-edit',
  standalone: true,
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  imports: [DynamicFormComponent, ListErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(formsActions.setStructure({ structure }));

    this.store
      .select(articleQuery.selectData)
      .pipe(untilDestroyed(this))
      .subscribe((article) => this.store.dispatch(formsActions.setData({ data: article })));
  }

  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  submit() {
    this.store.dispatch(articleEditActions.publishArticle());
  }

  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }
}
