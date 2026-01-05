import { CreatedAt } from '@domain/value-object/created-at.vo';
import { UpdatedAt } from '@domain/value-object/updated-at.vo';
import { AuditUser } from '@domain/value-object/audit-user.vo';
import { NullableTime } from '@domain/value-object/nullable-time.vo';
import { Version } from '@domain/value-object/version.vo';

export interface AuditProps {
  createdAt: CreatedAt;
  createdBy: AuditUser;
  updatedAt: UpdatedAt;
  updatedBy: AuditUser;
  archivedAt: NullableTime;
  deletedAt: NullableTime;
  version: Version;
}

export class Audit {
  private readonly props: AuditProps;

  private constructor(props: AuditProps) {
    this.props = props;
  }

  public static create(user: AuditUser): Audit {
    const now = CreatedAt.create();
    return new Audit({
      createdAt: now,
      createdBy: user,
      updatedAt: UpdatedAt.create(now.getValue()),
      updatedBy: user,
      archivedAt: NullableTime.empty(),
      deletedAt: NullableTime.empty(),
      version: Version.initial(),
    });
  }

  public static restore(props: AuditProps): Audit {
    return new Audit(props);
  }

  public touch(user: AuditUser): Audit {
    return new Audit({
      ...this.props,
      updatedAt: this.props.updatedAt.touch(),
      updatedBy: user,
      version: this.props.version.increment(),
    });
  }

  public archive(user: AuditUser): Audit {
    return new Audit({
      ...this.props,
      archivedAt: NullableTime.create(new Date()),
    }).touch(user);
  }

  public unarchive(user: AuditUser): Audit {
    return new Audit({
      ...this.props,
      archivedAt: NullableTime.empty(),
    }).touch(user);
  }

  public delete(user: AuditUser): Audit {
    return new Audit({
      ...this.props,
      deletedAt: NullableTime.create(new Date()),
    }).touch(user);
  }

  public undelete(user: AuditUser): Audit {
    return new Audit({
      ...this.props,
      deletedAt: NullableTime.empty(),
    }).touch(user);
  }

  public isActive(): boolean {
    return this.props.archivedAt.isEmpty() && this.props.deletedAt.isEmpty();
  }

  public isArchived(): boolean {
    return !this.props.archivedAt.isEmpty();
  }

  public isDeleted(): boolean {
    return !this.props.deletedAt.isEmpty();
  }

  public getProps(): AuditProps {
    return Object.freeze({ ...this.props });
  }

  public toJSON() {
    return {
      created_at: this.props.createdAt.toJSON(),
      created_by: this.props.createdBy.toJSON(),
      updated_at: this.props.updatedAt.toJSON(),
      updated_by: this.props.updatedBy.toJSON(),
      archived_at: this.props.archivedAt.toJSON(),
      deleted_at: this.props.deletedAt.toJSON(),
      version: this.props.version.toJSON(),
    };
  }
}
