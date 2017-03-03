// Copyright 2016 Documize Inc. <legal@documize.com>. All rights reserved.
//
// This software (Documize Community Edition) is licensed under
// GNU AGPL v3 http://www.gnu.org/licenses/agpl-3.0.en.html
//
// You can operate outside the AGPL restrictions by purchasing
// Documize Enterprise Edition and obtaining a commercial license
// by contacting <sales@documize.com>.
//
// https://documize.com

import Ember from 'ember';
import NotifierMixin from '../../mixins/notifier';
import TooltipMixin from '../../mixins/tooltip';

export default Ember.Component.extend(NotifierMixin, TooltipMixin, {
	sectionService: Ember.inject.service('section'),
	viewMode: true,
	editMode: false,

	didReceiveAttrs(){
		this.audit.record("viewed-document-section-" + this.get('model.page.contentType'));
	},

	didInsertElement() {
		let self = this;
		this.get('sectionService').refresh(this.get('document.id')).then(function (changes) {
			changes.forEach(function (newPage) {
				let oldPage = self.get('page');
				if (!_.isUndefined(oldPage) && oldPage.get('id') === newPage.get('id')) {
					oldPage.set('body', newPage.get('body'));
					oldPage.set('revised', newPage.get('revised'));
					self.showNotification(`Refreshed ${oldPage.get('title')}`);
				}
			});
		});
	},

	actions: {
		onExpand() {
			this.set('expanded', !this.get('expanded'));
		},

		onSavePageAsBlock(block) {
			this.attrs.onSavePageAsBlock(block);
		},

		onCopyPage(documentId) {
			this.attrs.onCopyPage(this.get('page.id'), documentId);
		},

		onMovePage(documentId) {
			this.attrs.onMovePage(this.get('page.id'), documentId);
		},
		
		onDeletePage(deleteChildren) {
			let page = this.get('page');

			if (is.undefined(page)) {
				return;
			}

			let params = {
				id: page.get('id'),
				title: page.get('title'),
				children: deleteChildren
			};

			this.attrs.onDeletePage(params);
		},

	}
});
